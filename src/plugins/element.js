import Vue from 'vue'
import { Button, Slider, Input,
  InputNumber, Switch,
  Select,
  Option,
  OptionGroup,
  Form,
  FormItem,
  Icon,
  Message,
  Collapse,
  CollapseItem,
  ColorPicker, } from 'element-ui'

Vue.use(Button)
Vue.use(Slider)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Switch)
Vue.use(Select)
Vue.use(Option)
Vue.use(OptionGroup)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(ColorPicker);
Vue.use(Icon)
Vue.use(Collapse);
Vue.use(CollapseItem)
Vue.prototype.$message = Message;