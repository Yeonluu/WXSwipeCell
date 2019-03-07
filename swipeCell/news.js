/**
 * Created by Yeonluu on 2017/11/27.
 * SwipeCell Demo
 */

const pxScale = wx.getSystemInfoSync().windowWidth/750

Page({
    data: {
        buttonWidth: 140, // 单位rpx
        swipeIndex: -1,
        swipeDistance: 0,
        buttons: [
            {style: 'stick', title: '置顶', background: 'orange'},
            {style: 'read', title: '标为已读', background: 'darkgray'},
            {style: 'share', title: '分享', background: 'limegreen'},
            {style: 'delete', title: '删除', background: 'red'},
        ],
        dataList: [],
    },

    onReady: function () {
        this.setData({
            dataList: this.getDataList()
        })
    },

    /**
     * 侧滑菜单按钮点击事件
     */
    menuButtonTap: function(event) {
        let index = event.currentTarget.dataset.index
        let dataList = this.data.dataList
        let style = event.currentTarget.dataset.style

        // TODO：具体业务功能自行实现
        switch (style) {
            case 'stick':
                break
            case 'read':
                break
            case 'share':
                break
            case 'delete':
                break
        }

        let title = event.currentTarget.dataset.title
        wx.showToast({
            title: title+'成功',
            icon: 'success',
            duration: 1000
        })

        dataList[index].leftDistance = 0
        this.setData({
            swipeIndex: -1,
            swipeDistance: 0,
            dataList: dataList,
        })
    },


    // 手指触摸动作开始
    touchStart: function(event){
        let index = event.currentTarget.dataset.index

        // 若已有侧滑栏，则先归位该栏
        if (this.data.swipeIndex >= 0) {
            let dataList = this.data.dataList
            dataList[this.data.swipeIndex].leftDistance = 0
            this.setData({
                swipeIndex: -1,
                swipeDistance: 0,
                dataList: dataList
            })
        }

        // 记录触摸开始位置
        if(event.touches[0]|| !event.currentTarget.dataset.editable){
            this.data.startX = event.touches[0].clientX
            this.data.startY = event.touches[0].startY
            // this.setData({
            //   startX: event.touches[0].clientX,
            //   startY: event.touches[0].clientY
            // })
        }
    },

    // 手指触摸后移动
    touchMove: function(event){
        if (!event.touches[0] || !event.currentTarget.dataset.editable) {
            return
        }

        let moveX = event.touches[0].clientX
        let distanceX = this.data.startX - moveX

        // 右滑直接返回
        if (distanceX < 0) {
            return
        }

        let index = event.currentTarget.dataset.index
        let moveY = event.touches[0].clientY
        let distanceY = Math.abs(this.data.startY - moveY)
        // 屏蔽垂直滑动的情况
        if (!this.data.swipeDistance && distanceY > distanceX) {
            return
        }

        let dataList = this.data.dataList
        var leftDistance = 0
        if(distanceX > 0 ){
            // 不能超过最大可侧滑距离
            leftDistance = -Math.min(distanceX, dataList[index].maxLeftDistance)
        }
        // px转换成rpx
        dataList[index].leftDistance = leftDistance*pxScale
        this.setData({
            swipeDistance: -leftDistance,
            dataList: dataList
        })
    },

    // 手指触摸动作结束
    touchEnd: function(event){
        if (!event.changedTouches[0] || !this.data.swipeDistance) {
            return
        }
        let endX = event.changedTouches[0].clientX
        let distanceX = this.data.startX - endX
        let dataList = this.data.dataList
        let index = event.currentTarget.dataset.index
        let maxLeftDistance = dataList[index].maxLeftDistance
        // 如果滑动距离超过1/3，则显示完整侧滑菜单，否则缩回0
        let leftDistance = distanceX > maxLeftDistance/3 ? -maxLeftDistance : 0
        dataList[index].leftDistance = leftDistance*pxScale
        this.setData({
            swipeIndex: leftDistance == 0 ? -1 : index,
            swipeDistance: -leftDistance,
            dataList: dataList,
        })
    },

    /*
     *  获取本地测试数据
     */
    getDataList: function () {
        let list = [
            {
                title: '苹果：高通偷了我们工程师的创意',
                detail: '周一，苹果公司与高通公司之间的最新一场专利诉讼在圣迭戈拉开序幕。苹果声称，这个创意由公司前工程师阿诸纳·希瓦提出，其在与高通工程师在一封邮件通信中讨论了这项技术。这项专利涉及“在多处理系统中，主处理器直接向一个或多个协处理器分装加载可执行软件图像”。',
                buttons: [0, 1, 3]
            },
            {
                title: '新浪Q4营收5.73亿美元，同比增长14%',
                detail: '36氪讯，新浪今日发布2018年第四季度财报，财报显示：净营收5.73亿美元，同比增长14%；净利润1640万美元，去年同期为4540万美元。',
                buttons: [1, 2, 3]
            },
            {
                title: '趣头条Q4营收13.27亿元，同比增426.1%',
                detail: '36氪讯，趣头条发布第四季度财报。报告显示，趣头条Q4营收13.27亿元，同比增长426.1%，高于分析师预期的12.9亿元；净亏损3.98亿元，亏损同比扩大629%；四季度日活用户数3090万，同比增长224.2%；预计2019年第一季度净营收11-11.20亿元，分析师预期为12亿。财报发布后，趣头条盘后转跌，截至发稿已下跌超14%。',
                buttons: [0, 3]
            },
            {
                title: '字节跳动搜索业务开启商业化',
                detail: '字节跳动于2017年开始布局搜索，并于今年初启动商业化，深入百度腹地。如今，除了基本的站内搜索功能之外，在今日头条App上已经可以搜索到不少来自站外的内容。',
                buttons: [1, 3]
            },
            {
                title: '特斯拉称已与中国海关达成清关问题的解决方案',
                detail: '据路透，特斯拉周二表示，中国海关已经接受了公司解决Model 3轿车清关问题的方案，无法清关主要是因Model 3轿车标识不合规。“我们已经与中国海关就解决方案达成了一致，正在与他们密切合作，以重启这些轿车的清关程序，”特斯拉发言人在声明中称，“Model 3在中国的销售未受影响，我们继续交付已清关的车辆。”',
                buttons: [2, 3]
            },
            {
                title: '微信支付测试“朋友会员”功能',
                detail: '',
                buttons: [0]},
            {
                title: '小电充电：66个城市可用“微信支付分”免押金租借',
                detail: '',
                buttons: [2]
            },
            {
                title: '阿里升级消费者运营和服务企业能力：蒋凡兼任天猫总裁，靖捷任CEO助理',
                detail: '',
                buttons: [2]
            },
            {
                title: '马化腾：希望有关部门对网约车等新事物切勿一刀切',
                detail: '',
                buttons: [3]
            },
        ]

        let btns = this.data.buttons
        let btnW = this.data.buttonWidth
        list.forEach(function (value) {
            var buttons = []
            value.buttons.forEach(function (index) {
                buttons.push(btns[index])
            })
            value.buttons = buttons
            value.maxLeftDistance = buttons.length * btnW
        })
        return list
    }


})
