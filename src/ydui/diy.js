import Vue from 'vue';
import { Popup } from 'vue-ydui/dist/lib.rem/popup';
/* 使用px：import {Popup} from 'vue-ydui/dist/lib.px/popup'; */
import { Button, ButtonGroup } from 'vue-ydui/dist/lib.rem/button';
/* 使用px：import {Button, ButtonGroup} from 'vue-ydui/dist/lib.px/button'; */
import { SendCode } from 'vue-ydui/dist/lib.rem/sendcode';
/* 使用px：import {SendCode} from 'vue-ydui/dist/lib.px/sendcode'; */
import { Icons } from 'vue-ydui/dist/lib.rem/icons';
/* 使用px：import {Icons} from 'vue-ydui/dist/lib.px/icons'; */
import { CellGroup, CellItem } from 'vue-ydui/dist/lib.rem/cell';
/* 使用px：import {CellGroup, CellItem} from 'vue-ydui/dist/lib.px/cell'; */
import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.rem/dialog';
/* 使用px：import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.px/dialog'; */
import { Input } from 'vue-ydui/dist/lib.rem/input';
/* 使用px：import {Input} from 'vue-ydui/dist/lib.px/input'; */
Vue.component(Input.name, Input);
Vue.component(CellGroup.name, CellGroup);
Vue.component(CellItem.name, CellItem);
Vue.component(Icons.name, Icons);
Vue.component(SendCode.name, SendCode);
Vue.component(Button.name, Button);
Vue.component(ButtonGroup.name, ButtonGroup);
Vue.component(Popup.name, Popup)
Vue.prototype.$dialog = {
    confirm: Confirm,
    alert: Alert,
    toast: Toast,
    notify: Notify,
    loading: Loading
};
