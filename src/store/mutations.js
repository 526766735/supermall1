import { ADD_COUNTER, ADD_TO_CART } from "./mutation-types"
export default {
    // 修改state内容只能通过mutation
    [ADD_COUNTER](state, payload) {
        payload.count++
    },
    [ADD_TO_CART](state, payload) {
        payload.checked = true
        state.cartList.push(payload)
    },

}