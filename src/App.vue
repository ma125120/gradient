<template>
  <div id="app">
    <div class="flex between relative main">
      <div class="display-area">
        <div class="canvas-div" :style="canvasStyle"></div>
        <canvas ref="canvas" class="canvas"></canvas>
      </div>

      <div class="input--section">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="宽度">
            <el-input-number v-model="form.width" :min="1" :max="20000"></el-input-number>
          </el-form-item>
          <el-form-item label="高度">
            <el-input-number v-model="form.height" :min="1" :max="20000"></el-input-number>
          </el-form-item>
          <el-form-item label="活动区域">
            <el-select v-model="form.direction" placeholder="请选择渐变方向">
              <el-option
                :label="direction.label"
                v-for="direction in directions"
                :key="direction.value"
                :value="direction.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始颜色">
            <el-input v-model="form.startColor"></el-input>
            <el-color-picker v-model="form.startColor" @active-change="changeColor($event, 'startColor')"></el-color-picker>
          </el-form-item>
          <el-form-item label="结束颜色">
            <el-input v-model="form.stopColor"></el-input>
            <el-color-picker v-model="form.stopColor" @active-change="changeColor($event, 'stopColor')"></el-color-picker>
          </el-form-item>
          <el-form-item label="图片名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="图片类型">
            <el-select v-model="form.imgType" placeholder="请选择渐变方向">
              <el-option
                :label="type.label"
                v-for="type in types"
                :key="type.value"
                :value="type.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="图片质量" v-if="form.imgType == 'jpg'">
            <el-slider v-model="form.quality" :show-input="false"></el-slider>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="exportImg">导出图片</el-button>
            <el-button @click="saveSetting">保存此配置</el-button>
          </el-form-item>

          <el-collapse v-model="activeNames">
            <el-collapse-item title="css代码" name="1">
              <div class="label">{{ getSuggestStyle(form) }}</div>
              <el-button type="primary" @click="copy">复制代码</el-button>
            </el-collapse-item>
          </el-collapse>

        </el-form>
      </div>
    </div>

    <div class="suggest-section">
      <h2 class="suggest-title">推荐配置</h2>
      <ul class="suggests flex" :style="`width: ${ 220 * gradients.length }px`">
        <li
          class="suggest-item relative"
          @click="setSuggest(gradient)"
          v-for="(gradient, i) in gradients"
          :key="i">
          <div :style="getSuggestStyle(gradient)"></div>
          <i class="el-icon-close close" @click="delGradient(i)"></i>
        </li>
        <li
          class="suggest-item relative"
          @click="setSuggest(gradient)"
          v-for="(gradient, i) in defaultGradients"
          :key="i + gradients.length">
          <div :style="getSuggestStyle(gradient)"></div>
        </li>

      </ul>
    </div>
    <div id="empty"></div>
    <a ref="link" :href="href" :download="form.name + '.' + form.imgType"></a>
  </div>
</template>

<script>
import gradients from '@/util/gradient.js'
import {
  getStore,
  setStore,
  dataURIToURL
} from '@/util/index.js';
import copy from '@/util/copy.js'

export default {
  name: 'app',
  components: {

  },
  data() {
    return {
      value1: 20,
      form: {
        width: 400,
        height: 400,
        direction: 'to bottom',
        startColor: '#000',
        stopColor: '#fff',
        name: '1',
        imgType: 'png',
        quality: 100,
      },
      href: '',
      activeNames: ['1'],

      directions: [
        { label: '从左到右', value: 'to right', },
        { label: '从右到左', value: 'to left', },
        { label: '从上到下', value: 'to bottom', },
        { label: '从下到上', value: 'to top', },

        { label: '从左上到右下', value: 'to right bottom', },
        { label: '从右上到左下', value: 'to left bottom', },
        { label: '从右下到左上', value: 'to left top', },
        { label: '从左下到右上', value: 'to right top', },
      ],
      types: [
        { label: 'png', value: 'png', },
        { label: 'jpg', value: 'jpg', },
      ],
      gradients: [],
      defaultGradients: gradients,
    }
  },
  computed: {
    canvasStyle() {
      var { width = 400, height = width, direction, startColor, stopColor } = this.form;
      return `width: ${width}px; height: ${height}px; background: linear-gradient(${direction}, ${startColor}, ${stopColor});`
    }
  },
  created() {
    this.form = { ...this.form, ...gradients[0], };
    this.gradients = (getStore() || []);
  },
  methods: {
    copy() {
      copy('#empty', this.getSuggestStyle(this.form));
      this.$message({ message: '复制成功', type: 'success' });
    },
    saveSetting() {
      var arr = getStore() || [];
      var _gradients = [ this.form ].concat(arr);
      this.saveToLocal(_gradients, '保存成功')
    },
    delGradient(i) {
      var arr = getStore() || [];
      var _gradients = [ ...arr ];
      _gradients.splice(i, 1);
      this.saveToLocal(_gradients, '删除成功');
    },
    saveToLocal(_gradients, message = '保存成功') {
      setStore(_gradients);
      this.gradients = _gradients;
      this.$message({
        message,
        type: 'success'
      });
    },
    changeColor(color, field, ) {
      this.form[field] = color;
    },
    exportImg() {
      var canvas = this.$refs.canvas;
      var { width = 400, height = width, direction, startColor, stopColor, imgType, quality } = this.form;
      quality = quality || 100;
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext("2d");
      var grd = ctx.createLinearGradient.apply(ctx, this.getPosition(direction, width, height));
      grd.addColorStop(0, startColor);
      grd.addColorStop(1, stopColor);

      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, width, height);
      imgType = imgType == 'jpg' ? 'image/jpeg' : 'image/png';
      var img = canvas.toDataURL(imgType, quality / 100);
      img = dataURIToURL(img);
      var link = this.$refs.link;
      this.href = img;

      setTimeout(() => {
        link.click();
      }, 100);
    },
    getPosition(direction, width, height) {
      direction = direction.trim();
      var pos = {
        'to right': [ 0, 0, width, 0, ],
        'to left': [ width, 0, 0, 0, ],
        'to bottom': [ 0, 0, 0, height, ],
        'to top': [ 0, height, 0, 0, ],

        'to right bottom': [ 0, 0, width, height, ],
        'to left bottom': [ width, 0, 0, height, ],
        'to left top': [ width, height, 0, 0, ],
        'to right top': [ 0, height, width, 0, ],
      }

      return pos[direction];
    },
    getSuggestStyle(item) {
      var { direction, startColor, stopColor } = item;
      return `width: 200px; height: 200px; background: linear-gradient(${direction}, ${startColor}, ${stopColor});`
    },
    setSuggest(gradient) {
      this.form = { ...this.form, ...gradient, };
    }
  }
}
</script>

<style lang="scss">
@import './index.scss'
</style>
