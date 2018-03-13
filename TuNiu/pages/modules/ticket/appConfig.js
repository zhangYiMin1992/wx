let host = "https://m.tuniu.com";

export default {
  APIs: {
    //search
    search: host + '/m2015/mpChannel/searchInfoAjax',
    getCityCode: host + '/m2015/global/index',
    suggestion: host + '/m2015/mpChannel/suggestionAjax',
    //orderlist
    orderList: host + '/m2015/ticket/order/OrderListForWxAjax',
    deleteOrder: host + '/api/user/order/deleteOrderForWx',

    //orderDetail
    orderDetail: host + '/m2015/ticket/order/ticketOrderDetailForWxAjax',
    refundStatus: host + '/m2015/ticket/order/ticketRefundOrderStatusForWxAjax',
    refundLoss: host + '/m2015/ticket/order/TicketLossInfoForWxAjax',
    refund: host + '/m2015/ticket/order/ticketRefundOrderForWxAjax',
    //ticketDetail
    ticketDetail: host + '/m2015/ticket/order/ticketCertificationsForWxAjax',

    //Scenic Detail
    scenicDetail: host + '/m2015/ticket/scenic/scenicAjax',
    scenicDetailIntroJson: host + '/m2015/ticket/scenic/detailIntroJsonAjax',
    remark: host + '/m2015/ticket/scenic/remarkAjax',

    //order
    bookInfo: host + '/m2015/ticket/order/BookInfoForWxAjax',
    touristList: host + '/m2015/ticket/order/TouristListForWxAjax',
    addTourist: host + '/m2015/ticket/order/AddTouristForWxAjax',
    book: host + '/m2015/ticket/order/BookForWxAjax',
    canPay: host + '/api/ticket/order/canPayForWx',

    //login
    beginSession: host + '/api/user/auth/beginSession',
    captcha: host + '/api/user/auth/captcha',
    sendCode: host + '/api/user/auth/sendCode',
    weapplogin: host + '/api/user/auth/weapplogin',

    //wechat
    bindPreAjax: host + '/weApp/weApp/bindPreAjax',
    bindPartnerUserAjax: host + '/weApp/weApp/bindPartnerUserAjax',
    ticketPay: host + '/weApp/weApp/ticketPay'
  },
  config: {
    pValue: 27009,
    serviceId: 21
  }
}