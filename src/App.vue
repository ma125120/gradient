<template>
  <div id="app">
    <div class="flex between relative">
      <div class="display-area">
        <div class="canvas-div" :style="canvasStyle"></div>
        <canvas ref="canvas" class="canvas"></canvas>
      </div>

      <div class="input--section">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="宽度">
            <el-input-number v-model="form.width" :min="1" :max="20000"></el-input-number>
            <!-- <el-input v-model="form.width"></el-input> -->
          </el-form-item>
          <el-form-item label="高度">
            <el-input-number v-model="form.height" :min="1" :max="20000"></el-input-number>
            <!-- <el-input v-model="form.height"></el-input> -->
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
            <el-color-picker v-model="form.startColor"></el-color-picker>
          </el-form-item>
          <el-form-item label="结束颜色">
            <el-input v-model="form.stopColor"></el-input>
            <el-color-picker v-model="form.stopColor"></el-color-picker>
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
          </el-form-item>
        </el-form>

        <!-- <el-button @click="">el-button</el-button> -->
      </div>
    </div>

    <div class="suggest-section">
      <h2 class="suggest-title">推荐配置</h2>
      <ul class="suggests flex" :style="`width: ${ 220 * gradients.length }px`">
        <li
          class="suggest-item"
          :style="getSuggestStyle(gradient)"
          @click="setSuggest(gradient)"
          v-for="(gradient, i) in gradients"
          :key="i"></li>
      </ul>
    </div>
    <a ref="link" :href="href" :download="form.name + '.' + form.imgType"></a>
  </div>
</template>

<script>
import gradients from '@/util/gradient.js'

function dataURIToURL(dataURI) {
  var binStr = atob(dataURI.split(',')[1]),
    len = binStr.length,
    arr = new Uint8Array(len);

  for (var i = 0; i < len; i++) {
    arr[i] = binStr.charCodeAt(i);
  }

  return URL.createObjectURL(new Blob([arr]));
}

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
      gradients,
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
  },
  methods: {
    exportImg() {
      var canvas = this.$refs.canvas;
      var { width = 400, height = width, direction, startColor, stopColor, imgType, quality } = this.form;
      quality = quality || 100;
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext("2d");
      var grd = ctx.createLinearGradient(0, height, 0, 0);
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

<style>
* {
  padding: 0;
  margin: 0;
}
ul, ol {
  list-style: none;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background: #ededed;
  padding: 40px 60px;
  min-height: 100vh;
  box-sizing: border-box;
}
#app .el-form-item__content {
  display: flex;
}
#app .el-slider {
  min-width: 212px;
}
.flex {
  display: flex;
  flex-direction: row;
}
.wrap {
flex-wrap: wrap;
}
.column {
  flex-direction: column;
}
.all-center {
  align-items: center;
  justify-content: center;
}
.justify-center {
  align-items: center;
}
.align-center {
  align-items: center;
}
.between {
  justify-content: space-between;
}
.space {
  justify-content: space-around;
}
.box {
  box-sizing: border-box;
}

.canvas {
  position: absolute;
  z-index: -1;
  top: -10000px;
}
.input--section {
  background: #fff;
  border-radius: 6px;
  box-sizing: border-box;
  padding: 20px;
  width: 400px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, .05)
}
.suggest-title {
  text-align: left;
  margin-bottom: 6px;
  font-size: 20px;
  color: #333;
}
.display-area {
  margin-right: 60px;
  overflow: auto;
  height: calc(100vh - 80px - 294px);
}
.suggest-section {
  width: calc(100vw - 120px);
  background: #fff;
  border-radius: 6px;
  box-sizing: border-box;
  padding: 20px;
  overflow: auto;
  margin-top: 12px;
}
.suggests {
  /* overflow-x: auto; */
  padding-bottom: 8px;
}
.suggest-item {
  box-shadow: 0 0 0 rgba(0, 0, 0, .2);
  transition: box-shadow .3s ease-in-out;
}
.suggest-item:hover {
  cursor: pointer;
  box-shadow: 0 10px 40px rgba(0, 0, 0, .2);
  transition: box-shadow .3s ease-in-out;
}
.suggest-item+.suggest-item {
  margin-left: 20px;
}
::-webkit-scrollbar
{
    width: 5px;
    height: 5px;
    background-color: #F5F5F5;
    cursor: pointer;
}
/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track
{
    box-shadow: inset 0 0 1px rgba(0,0,0, 0);
    border-radius: 10px;
    background-color: #F5F5F5;
    cursor: pointer;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb
{
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(0,0,0, .3);
    background-color: rgb(192, 192, 192)
}
</style>
