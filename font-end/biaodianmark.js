var taskId, markTaskId;
var getInfo = function (pTaskId, pMarkTaskId) {
    taskId = pTaskId;
    markTaskId = pMarkTaskId;
};
// firstAuto 为了解决聚焦后不离开问题
require(['vue','_public','ass_common','ass_common_api','WaveSurfer','regions'], function (Vue,_public,ass_common,ass_common_api,WaveSurfer,regions) {
    require(['audio_common'],function (audio_common) {
        var Version = window.navigator.userAgent;
        var self = null,wave = null ,firstAuto = 0,html = {
            text: '<div id="content">\
                        <link href="/static/css/component/common.css" rel="stylesheet"/>\
                        <link href="/static/css/component/biaodianguizheng/common.css" rel="stylesheet"/>\
                        <div class="head">\
                            <span class="name">{{curFileName}}</span>\
                            <div class="select-box">\
                                <span class="keyboard"><i class="icon"></i>快捷键\
                                    <div class="showBox" style="color: #000;">\
                                        <div class="table">\
                                            <table width="100%">\
                                                <thead><tr><th>功能说明</th><th>热键</th></tr></thead>\
                                                <tbody>\
                                                    <tr><td>上一条</td><td>Ctrl+Tab</td></tr>\
                                                    <tr><td>下一条</td><td>Tab</td></tr>\
                                                    <tr><td>播放</td><td>Enter</td></tr>\
                                                </tbody>\
                                            </table>\
                                        </div>\
                                    </div>\
                                </span>\
                                <span class="stand"><i class="icon"></i>标注规范\
                                    <transition name="fade"><div class="showBox"><ul><p v-html="base.standard"></p></ul></div></transition>\
                                </span>\
                                <span class="history" @click="showHistory"><i class="icon"></i>历史</span>\
                            </div>\
                        </div>\
                        <div class="operation-box">\
                            <div class="radio-lt clearfix" v-show="!history.showVersionInfo">\
                                <label :class="getSelectClass(1)" @click="selectData(1)">所有数据 {{allNumber}}</label>\
                                <label :class="getSelectClass(2)" @click="selectData(2)">好数据 {{goodNumber}}</label>\
                                <label :class="getSelectClass(3)" @click="selectData(3)">坏数据 {{badNumber}}</label>\
                                <label :class="getSelectClass(4)" @click="selectData(4)">{{base.step == 0 ? \'未标注\' : base.step == 1 ? \'未检查\' : base.step == 2 ? \'未质检\' : \'其他\'}}{{noMarkNumber}}</label>\
                            </div>\
                            <div class="state">\
                                <div class="state_list">\
                                    <div class="curspan"><i class="list"></i>文件：<span class="fs14_bold">{{curNum}}</span>/{{files.showList.length}}</div>\
                                    <div class="markpro">完成进度：<span class="fs14_bold">{{finishNum}}</span>/{{files.all.length}}</div>\
                                </div>\
                                <div class="operation" v-show="!history.showVersionInfo">\
                                    <a class="save" @click="save">保存</a>\
                                    <a class="close" @click="repulse" v-if="base.step == 1">打回</a>\
                                    <a class="close" @click="closeResult">关闭</a>\
                                    <a class="submit" @click="submitResult">完成并提交</a>\
                                </div>\
                                <div class="operation" v-show="history.showVersionInfo">\
                                    <a class="close" @click="closeVersion">返回</a>\
                                    <a class="recover" @click="recoverVersion(null)">恢复到该版本</a>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="content-box" style="overflow: hidden">\
                            <div id="navigation">\
                                <div class="model">\
                                    <div class="shield" v-show="history.showVersionInfo"></div>\
                                    <ul>\
                                        <li :id="'+'\'na_\''+'+item.index" v-for="(item,index) in files.showList" \
                                            :title="item.name" @click="skipFile(item)" :style="getCurStyle2Li(item)">\
                                            <i :style="getCurStyle2I(item)"></i><span :style="hasPlayerCss(item)">{{index+1}}</span>.{{getFileName(item) | trim(11)}}\
                                        </li>\
                                    </ul>\
                                </div>\
                            </div>\
                            <div class="right">\
                                <div class="mediaBox">\
                                    <div class="player">\
                                        <i :style="getBadStyle()">已标</i>\
                                        <div class="loadProcess" :style="{width: 100}"></div>\
                                        <div style="position:relative;height:160px;">\
                                            <div id="waveform" class="waveform">\
                                                <div class="loadprogress" v-show="loadprogress != 100">{{loadprogress}}%</div>\
                                            </div>\
                                            <!--<span class="reLoad" @click="refreshCurPlayer"></span>-->\
                                        </div>\
                                    </div>\
                                    <!--<div class="num-lt">\
                                        <div class="bar markrole">\
                                            <div v-for="(item,index) in files.currentVads" @click="getFragment(item-1)" :class="vadCss(item)" :style=""><i></i><s></s><span>{{item}}</span></div>\
                                        </div>\
                                    </div>-->\
                                    <div class="controller">\
                                        <div class="nextbutton" v-show="!history.showVersionInfo">\
                                            <span @click = "prev">上一条</span>\
                                            <span v-show="hasNext" @click = "next">下一条</span>\
                                            <span v-show="!hasNext" @click = "save">保存最后一条</span>\
                                            <span v-show="isBad" @click = "markBadData(0)">标为好数据</span>\
                                            <span v-show="!isBad" @click = "markBadData(1)">标为坏数据</span>\
                                        </div>\
                                        <div class="playbutton">\
                                            <span @click = prePart class="prePart"></span>\
                                            <span @click ="playPart" :class="periphery.playButton" title="播放或暂停"></span>\
                                            <span @click ="nextPart" class="nextPart"></span>\
                                        </div>\
                                    </div>\
                                </div>\
                                <mark-component :currentData="files.current" :partIndex="files.partIndex" @getFragment="getFragment" @allBad="allBad" v-if="!history.showVersionInfo"></mark-component>\
                                <history-component :currentData="history.current.result" :partIndex="files.partIndex" v-if="history.showVersionInfo" @getFragment="getFragment"></history-component>\
                                <!--<div class="mark-content">\
                                    <ul class="mark-content-list"  v-if="self.current != null">\
                                        <li v-for="(item,index) in files.current.result.vads" class="content-item clearfix" :class="{active:index === files.partIndex}">\
                                            <div class="data-layer clearfix">\
                                                <span class="list-number"><p class="number" @click="getFragment(index)">{{index}}</p></span>\
                                                <div class="edit-area" contenteditable="true">{{item.txt}}</div>\
                                            </div>\
                                            <div class="handle-layer">\
                                                <span class="handle-common">"1"转"一"</span>\
                                                <span class="handle-common">"100"转"一百"</span>\
                                                <span class="handle-common">"1"转"幺"</span>\
                                                <span class="handle-common">坏</span>\
                                            </div>\
                                        </li>\
                                    </ul>\
                                </div>-->\
                            </div>\
                        </div>\
                        <transition name="fade">\
                    <div class="pop" v-show="history.show"> \
                        <div class="layer"></div>\
                            <div class="show_pop hislt"> \
                                <div class="poptitle"><i @click="history.show = false"></i><span class="fs14">历史</span></div>\
                                <div class="contain">\
                                    <table width="100%">\
                                        <thead><tr><th>ID</th><th>是否自动保存</th><th>版本</th><th>结果</th><th>时间</th><th>操作</th></tr></thead>\
                                        <tbody>\
                                            <tr v-for="(item,index) in history.list">\
                                                <td>{{index + 1}}</td>\
                                                <td>{{item.isAutoSave == 0 ? "手动": item.isAutoSave == 1 ? "自动" : "--" }}</td>\
                                                <td>{{item.version}}</td>\
                                                <td><a class="rem-btn" @click="viewVersion(item)">查看结果</a></td>\
                                                <td width="100">{{item.createTime | toDateTime}}</td>\
                                                <td><a class="rem-btn" @click="recoverVersion(item)">恢复到该版本</a></td>\
                                            </tr>\
                                        </tbody>\
                                    </table>\
                                </div>\
                            </div>\
                        </div>\
                </transition>\
                    </div>'
        }, Component = { // 主控件部分
            template: html.text,
            data: function () {
                return {
                    base: {
                        batchId: '',
                        step: '',
                        lastMarkTaskId:null, // 上次标注的标注任务id 如果是检查任务，该值是标注id，如果是质检任务，可能是检查也可能是标注
                        standard: '--',// 标注规范,
                        videoFinish:0, // 每次修改代表一个音频文件初始化完毕
                    },
                    loadprogress:0,  // 当前播放器
                    files: {
                        all: [],// 所有数据，含有info，以及lastSubmit信息
                        showList: [],// 当前数据列表
                        showType: 1,// 1 表示全部 2 表示好数据，3表示坏数据，4表示未标注
                        current: null,// 当前数据
                        listIndex:0 , // 当前列表中的第几个数据 默认0
                        partIndex:0, // 当前播放数据的第几段
                        curIndex: 0,// 默认播放第0个
                        lastIndex: 0,// 用于记录在 showType为1情况下的当前的数据，而非跳转到第一个
                        currentPartNumber:0, // 当前共有多少片段
                        currentVads: [], // 片段序号i
                    },
                    periphery: { // 周边
                        playButton:'start'
                    },
                    operate: { // 操作
                        autoSaveInterval: null,// 自动保存
                        isMultiSelect: false,// 如果有标签层，是否是多选
                        isKeydownPrepare:true,// 输入框是否获取焦点，默认没有
                        refresh:0,// 用于状态刷新
                    },
                    history: {
                        show: false, // 是否展示历史列表
                        showVersionInfo:false, // 是否显示某个版本的数据
                        list: [],// 历史结果列表
                        current:null,// 选中的历史
                    },
                    players: {
                        repeat: false,//全局控制是否重复播放
                        repeatTimes:3,// 重复播放设置
                        errorRange:0.2,// 设置选中边界的误差范围 单位s
                        limit:1,// 预加载的个数
                        files:[],// 包含current的音频数据 存储了player
                        No:0,// 默认播放第一个
                        current:null,
                    }
                };
            },
            created: function () {
                // var a = new WaveInit(WaveSurfer,regions,{},{data:[]})
                var tip = 0;
                self = this;
                document.onkeydown = function (e) {
                    if(self.operate.isKeydownPrepare === false) return;
                    var e = e || window.event, code = e.keyCode || e.which || e.charCode;
                    shortKeyIfTrue(code == 13, function () { // Enter 播放
                        self.playPart();
                    }, e);
                    shortKeyIfTrue(code == 9, function () { // tab 下一句
                        self.next();
                    }, e);
                    shortKeyIfTrue(e.ctrlKey && code == 9, function () { // tab 上一句 阻止不了该快捷键的行为
                        self.prev();
                    }, e);
                    $(document).on('copy',function (e) {

                    })
                    $(document).on('paste',function (e) {
                        /*if (Version.indexOf('Chrome') > -1) {

                        }else{
                            if (tip === 0) {
                                 tip = setTimeout(function () {
                                    ui.fade('暂不支持粘贴功能')
                                    tip = 0
                                },200)
                            }
                            return false
                        }*/
                    })
                };
            },
            mounted: function () {
                require(['scrollbar'], function (scrollbar) {
                    $("#navigation").mCustomScrollbar({
                        autoDraggerLength: true,
                        scrollInertia: 250,
                        mouseWheelPixels: 60,
                    });
                    self.initLoad();
                    // self.initTest();
                });
            },
            methods: {
                // 模拟数据
                initTest:function () { // 测试使用
                    self.base.step = 0;
                    for(var i = 0;i<100;i++){
                        self.files.all.push({
                            index: i,
                            name: 'ceshiceshiceshi'+i+'.wav',
                            status: 0,// 用于过滤是否标注
                            result: {label:[], isBad:0,id:i,lastVadTime:8.8,
                                vads:[
                                    {"index":1,"range":[0,1.58],"rtxt":"后面再"+i,"tex1":"后面再","txt0":"后面再","label":["child"],"isBad":0},
                                    {"index":2,"range":[1.58,55.572],"rtxt":"广州广东话进过工厂"+i,"txt1":"广州广东话进过工厂","txt0":"广州广东话进过工厂","label":[],"isBad":0},
                                    {"index":3,"range":[55.572,88.8],"rtxt":"这是塑胶厂还有电子厂"+i,"txt1":"这是塑胶厂还有电子厂","txt0":"这是塑胶厂还有电子厂","label":["female","noise"],"isBad":0}]
                            },
                            url: '/static/mp3/test32.opus',// (不给我，不保存)
                            lastSubmit: {},// (我自己的)
                            player: null,// （我的,播放器实例）
                            isInit: true,// （我的）表示是否初始化完毕 ,status 为0 表示已初始结果为准，否则需要获取最新结果，false
                            saveSuccess:true,// （我的）
                        });
                    }
                    self.selectData(1); // 默认选择all
                },
                // 获取当前聚焦的元素值，并赋值
                getCurrentFocusElement:function(){
                    var focusElement = document.activeElement
                    var focusTest = focusElement.innerText
                    var index = $('.edit-area').index(focusElement)
                    if (index > -1 && firstAuto === 0) {
                        firstAuto = 1
                        self.files.current.result.vads[index].rtxt = focusTest
                        if (focusElement.children[0] !== undefined) {
                            focusElement.removeChild(focusElement.children[0])
                        }
                    }
                },
                // 请求数据
                initLoad: function () {
                    ass_api.getFileInfo(markTaskId, function (info) {
                        info = JSON.parse(info);
                        var step = info.step;
                        if ([0,1,2].indexOf(step) === -1) {
                            ass_api.error("页面类型异常");
                            return;
                        }
                        if (info.files.length == 0) {
                            ass_api.error("获取文件个数为0");
                            return;
                        }

                        self.base.step = step;
                        self.base.batchId = info.batchId;
                        self.base.standard = info.markStandard;
                        self.files.curIndex = info.lastIndex ? parseInt(info.lastIndex) - 1 : 0; // lastIndex从1开始

                        if (step == 0) {
                            $('title').text('标点规整-标注');
                        } else if (step == 1) {
                            $('title').text('标点规整-检查');
                        } else if (step == 2) {
                            $('title').text('标点规整-质检');
                        }
                        if(step == 1 || step == 2){
                            self.base.lastMarkTaskId = info.lastMarkTaskId;
                            if(isNull(self.base.lastMarkTaskId)){
                                ass_api.error("缺少标注任务信息");
                                return;
                            }
                        }

                        self.initFiles(info.files);
                        // self.selectFile(self.files.showList[0]);
                        self.operate.autoSaveInterval = setInterval(function () { // 20s一次 查看历史的时候跳过执行
                            if(!(self.history.show == true || self.history.showVersionInfo == true)){
                                // self.getCurrentFocusElement() 新方案 不需要
                                self.saveResult(true,true);// 自动，异步
                            }
                        }, 20000);
                    });
                },
                // 初始化文件 接受一个文件的全部信息
                initFiles: function (_files) {
                    var len = _files.length;
                    for (var i = 0; i < len; i++) {
                        var item = _files[i];
                        var dInfo = {}
                        try{
                            dInfo = JSON.parse(item.defaultresult)
                            // 处理range 强制转换为number类型
                            for (var k = 0;k < dInfo.vads.length;k++){
                                dInfo.vads[k].range = dInfo.vads[k].range.split(',')
                                dInfo.vads[k].isBad = 0 // 增加是否坏数据，默认为好
                                dInfo.vads[k].label = dInfo.vads[k].label ? dInfo.vads[k].label.trim().split(' ') : [] //  dInfo.vads[k].label && []
                                dInfo.vads[k].range[0] = Number(dInfo.vads[k].range[0])
                                dInfo.vads[k].range[1] = Number(dInfo.vads[k].range[1])
                                dInfo.vads[k].rtxt = dInfo.vads[k].txt0
                                // for (var j = 0; j < dInfo.vads[k].range.length; j++) {
                                //     dInfo.vads[j].range[0] = Number(dInfo.vads[k].range[0])
                                //     dInfo.vads[j].range[1] = Number(dInfo.vads[k].range[1])
                                //     console.log(dInfo.vads[j].range)
                                // }
                            }
                            dInfo.isBad = item.isBad
                            dInfo.label = dInfo.label.trim().split(' ')
                        }catch (e) {
                            dInfo = {}
                            console.log('must need defaultresult,but step is 1 or 2,must not need defaultresult')
                        }

                        if (isNotNull(item)) { // 文件不为空
                            self.files.all.push({
                                index: item.id,
                                name: item.name ? item.name : '--',
                                url: ass_api.getFileUrl({key: 'u-' + markTaskId + '-' + item.id,sid: window.localStorage.getItem("sid")}), // 音频url
                                result: dInfo,
                                lastSubmit: null,
                                player: null,
                                status: item.status,// 用于过滤是否标注 为0 （step !=0 则使用标注或者检查结果，为1使用自己的结果）
                                isInit: 0,// 表示尚未从结果服务获取数据
                                saveSuccess:true,//
                            });
                        }
                    }
                    self.selectData(1); // 默认选择all
                },
                // 获取当前类型数据列表
                selectData: function (_type) { // 选择对应的数据
                    self.files.showType = _type;
                    var len = self.files.all.length, showList = [];
                    if (_type === 1) { // 全部数据
                        showList = self.files.all;
                    }else {
                        for (var i = 0; i < len; i++) {
                            var item = self.files.all[i],data = {};
                            if (item.result.isBad === 0 && _type === 2) { // 好数据
                                showList.push(item);
                            } else if (item.result.isBad === 1 && _type === 3) { // 坏数据
                                showList.push(item);
                            } else if (item.status === 0 && _type === 4) { // 未标注
                                showList.push(item);
                            }
                        }
                    }

                    if (showList.length !== 0) {  // 存在数据
                        var len2 = showList.length;
                        for(var i = 0;i<len2;i++){
                            var file = showList[i];
                            file.last = i== 0 ? null : showList[i-1];
                            file.next = i == len - 1 ? null : showList[i+1];
                        }
                        self.files.showList = showList;
                        self.selectFile(self.files.showList[0]); // 默认选择第一个
                    }
                },
                // 选择单个文件
                selectFile: function (item) {
                    if(isNull(item)) return;
                    if(isNotNull(self.files.current) && isNotNull(self.files.current.player)){ // 此时files.current为上一次的结果
                        // 注意：需要清空player中的区域，否则会播放上次绘制区域范围的音频
                        self.files.current.player.destroy() // 销毁
                        self.files.current.player = null // 销毁对象
                    }
                    self.files.current = item; // 当前标注的文件
                    self.files.curIndex = item.index; // 默认播放的序号
                    self.files.currentPartNumber = item.result.vads ? item.result.vads.length : 0 // 总共有多少段
                    self.files.currentVads = [] // vad 片段序号
                    for (var i = 0; i < self.files.currentPartNumber; i++) {
                        self.files.currentVads.push(i+1)
                    }
                    // 初始化一个文件 （判断是否需要获取最新的内容 ， 主要是初始化 音频）
                    self.initFile (item)
                },
                //  初始化单个文件
                initFile: function (item) {
                    // 判断是否获取最新结果 并初始化音频
                    if (!item.isInit){ // 如果第一次直接获取结果服务
                        self.getCurResult(item)
                        self.initVideo()
                    }else { // 否则直接用当前文件
                        self.initVideo()
                    }
                },
                // 初始化音频(初始化音频是每一切换一条数据必须经过的步骤，在这里初始化partIndex)
                initVideo: function () {
                    self.files.partIndex = 0
                    var current = self.files.current // 获取当前播放对象
                    if (current.player) {  // 播放器实例已存在 删除
                        current.player.destroy() // 销毁
                        current.player = null // 销毁对象
                    }
                    current.player = new WaveInit(WaveSurfer,regions,{
                        container: '#waveform',
                        cursorColor: '#fcad1d',
                        waveColor: '#579676',
                        progressColor: '#08dc8c',
                        hideScrollbar:true,
                        height:160,
                        interact: false
                    },{
                        url:current.url,
                        init: true,
                        data:current.result.vads
                    },false)
                    // 监听当前wave实例的进入方法
                    current.player.Wave.on('region-in',function (e) {
                        var id = e.id
                        var index = $('.wavesurfer-region').index($("[data-id="+id+"]"))
                        self.files.partIndex = index
                    })
                    // 监听挡墙wave实例暂停
                    current.player.Wave.on('pause',function () {
                        self.periphery.playButton = "start"
                    })
                    // 监听wave实例开始
                    current.player.Wave.on('play',function () {
                        self.periphery.playButton = "stop"
                    })
                    current.player.Wave.on("loading", function (e) {
                        self.loadprogress = e
                        if (e === 100){
                            ui.fade("音频加载完毕，开始绘制图形");
                        }
                    })
                    // 监听创建完毕 （暂时无用）
                    current.player.Wave.on('region-created',function () {
                        /*self.base.videoFinish++
                        if(self.base.videoFinish === self.files.currentPartNumber){
                            self.getWidth()
                        }*/
                        // self.getWidth()
                    })
                },
                // 选择片段播放
                getFragment: function (index) {
                    self.files.partIndex = index
                    $('.wavesurfer-region').eq(index).trigger('click')
                },
                // 上一个片段
                prePart: function () {
                    var index = (self.files.partIndex - 1) <= 0 ? 0 : self.files.partIndex - 1
                    $('.wavesurfer-region').eq(index).trigger('click')
                },
                // 播放当前片段 （业务逻辑）
                playPart: function () {
                    var playStatus = self.isPlaying()
                    if (playStatus) {
                        self.files.current.player.pause()
                    }else{
                        var current = self.files.current
                        var start = Number(current.player.getCurrentTime())
                        var end = Number(current.result.vads[self.files.partIndex]["range"][1])
                        var partIndex = self.files.partIndex
                        if (start >= end - 0.05) {
                            if (partIndex + 1 > self.files.currentPartNumber - 1) { // 超过最后一段，不播放
                                return
                            }else{
                                start = Number(self.files.current.result.vads[self.files.partIndex + 1]["range"][0])
                                end = Number(self.files.current.result.vads[self.files.partIndex + 1]["range"][1])
                                // self.files.partIndex++
                            }
                        }
                        self.files.current.player.play([start,end])
                    }
                },
                // 下一个片段
                nextPart: function () {
                    var max = self.files.currentPartNumber - 1
                    var index = (self.files.partIndex + 1) >= max ? max : self.files.partIndex + 1
                    $('.wavesurfer-region').eq(index).trigger('click')
                },
                next: function () { // 下一条
                    if(self.saveResult(false,true)){// 异步手动保存
                        self.skip();
                    }
                },
                prev: function () { // 上一条
                    prejudgeM(function () {
                        // self.files.partIndex = 0
                        self.selectFile(self.files.current.last);
                    },function () {
                        return self.saveResult(false,true); // 顺利执行到保存，才进行跳转
                    },function () {
                        return isNotNull(self.files.current.last);
                    });
                },
                // 当前播放状态 (暂时无用)
                isPlaying: function () { // 查看播放状态
                    if(isNull(this.files.current)){
                        return false;
                    }
                    var player = self.files.current.player;
                    if(isNull(player)){
                        return false;
                    }
                    return player.isPlaying()
                },
                // markConvert 进行标记 （暂时无用）
                markConvert: function(type,index){

                },
                // 获取某个文件
                getFile: function (_fileIndex) {
                    if (_fileIndex === undefined) {
                        return self.files.current;
                    }
                    var len = self.files.showList.length;
                    for (var i = 0; i < len; i++) {
                        var item = self.files.showList[i];
                        if (item.index == _fileIndex) {
                            self.selectFile(item);
                            return item;
                        }
                    }
                    return null;
                },
                // 表为坏数据或者标为好数据
                markBadData:function (pValue) {
                    // 标好坏数据 1 坏数据 0 好数据
                    var file = self.getFile();
                    file.result.isBad = pValue; // 修改当前文件状态
                    if(pValue === 0){ // 标注好
                        self.changeItemData(0)
                        file.result.label = self.removeArrElement(file.result.label,'bad-audio')
                    }else{ // 标注坏
                        file.result.label.push('bad-audio')
                        self.changeItemData(1)
                        self.allBad()
                    }
                    self.refreshMark();
                },
                // 循环恢复原始数据或循环 标坏
                changeItemData: function (type) {
                    var file = self.files.current
                    var len = file.result.vads.length;
                    if (type === 0){
                        for (var i = 0 ;i < len ;i++){
                            file.result.vads[i].isBad = 0
                            file.result.vads[i].rtxt = file.result.vads[i].txt0
                            file.result.vads[i].label = self.removeArrElement(file.result.vads[i].label,'bad-audio')
                        }
                    }else {
                        for (var i = 0 ;i < len ;i++){
                            file.result.vads[i].isBad = 1
                            if (file.result.vads[i].label.indexOf('bad-audio') === -1) {
                                file.result.vads[i].label.push('bad-audio')
                            }
                            file.result.vads[i].rtxt = '坏'
                        }
                    }
                    console.log(self.files.all)
                },
                // 子组件触发的全是坏数据,或者主动触发
                allBad: function () {
                    if(self.saveResult(false,true)){// 异步手动保存
                        self.skip();
                    }
                    /* self.saveResult(false,true);// 标注坏 异步手动
                     self.skip();*/
                },
                // 跳过本条 flag 表示是否要进行判断音频是否播放完
                skip: function (flag) {
                    // self.files.partIndex = 0
                    self.selectFile(self.files.current.next);
                },
                // 跳转到某一条数据
                skipFile:function (item) {
                    prejudgeM(function () {
                        self.selectFile(item);
                    },function () {
                        return isNotNull(item);
                    },function () {
                        return self.saveResult(false,true); // 顺利执行到保存，才进行跳转
                    });
                },
                // 保存
                save:function () {
                    self.saveResult(false,false,undefined,function (error) {
                        ass_api.error(error,self.base.step);
                    });
                },
                // 保存结果
                saveResult: function (isAuto,async,success,errorMethod) {
                    self.refreshMark();
                    var file = self.getFile(),isOk = false; // 返回值，通知是否可用继续执行
                    prejudgeM(function () {
                        var params = {
                            lastIndex:file.index,
                            result:{
                                markTaskFileId:file.index,
                                batchId:self.base.batchId,
                                markTaskId:markTaskId,
                                stamp:file.result.isBad,
                                resultText:JSON.stringify(file.result),
                                isAutoSave: isAuto ? 1 : 0,
                            }
                        };

                        file.saveSuccess = false;
                        // 先修改status代表已标注 测试
                        ass_api.saveResult({markTaskId:markTaskId,markFileId:file.index},params,function () {
                            // if(!isAuto){file.status = 1;}// 已标注
                            file.saveSuccess = true;
                            file.status = 1;
                            file.lastSubmit = {isLastAuto:isAuto, result:JSON.stringify(file.result)};
                            success ? success():'';
                        },async,function (errorInfo) {
                            file.saveSuccess = false;  // 保存失败
                            errorMethod? errorMethod(errorInfo):'';
                        });
                        isOk = true;
                    },function () {
                        if(file == null){
                            ui.fade('获取数据信息为空');
                            return false;
                        }
                        if (!file.result.vads){
                            ui.fade('获取文本内容为空');
                            return false
                        }
                        var len = file.result.vads.length
                        if (len <= 0){
                            ui.fade('获取文本内容为空');
                            return false
                        }
                        for (var i = 0;i < len;i++){
                            var data = file.result.vads[i].rtxt;
                            if(!data.length) {
                                ui.fade('第'+(i+1)+'条文本框不能为空')
                                return false
                            }
                            if (/\d+| |#/.test(data)) {
                                ui.fade('第'+(i+1)+'条文本框中不允许有空格、阿拉伯数字、“#”')
                                return false
                            }
                        }
                        return true;
                    },function () {
                        // 判断数值是否有更改
                        // 自动 判断文本变化，无论上次是手动还是自动保存
                        // 手动 上次是自动，则不比较文本变化，如果上次是手动则比较变化
                        // 文本是否有变化，有变化保存，没有变化判断是否是自动保存和手动保存下上次也是手动保存
                        if(isNotNull(file.lastSubmit) && isNotNull(file.lastSubmit.result) && file.lastSubmit.result == JSON.stringify(file.result)){
                            if(isAuto || file.lastSubmit.isLastAuto === isAuto){ // isAuto == true 或者 isAuto 和 lastIsAuto 都为false 表示上次也是手动存储的
                                ui.fade("结果已保存"); //没有变化只给提示
                                // if(!isAuto){ file.status = 1;} // 如果是手动保存，则更改保存状态
                                success ? success():'';
                                isOk = true;
                                return false;
                            }
                        }
                        return true;
                    });
                    return isOk;
                },
                // 从结果服务获取最新结果
                getCurResult:function (file) { // 解析最新结果
                    if(file.isInit === 1) return;// 如果文件 isInit为 1 说明页面刷新后已经从结果拉去过一次
                    var pMarkTaskId,saveFirst; // 是否保存第一次加载的数据
                    if(file.status == 1){
                        pMarkTaskId = markTaskId;
                        saveFirst = false;
                    }else{
                        if(self.base.step == 1 || self.base.step == 2){
                            pMarkTaskId = self.base.lastMarkTaskId;
                            saveFirst = true;
                        }else{
                            pMarkTaskId = markTaskId;
                            saveFirst = false;
                            // return;
                        }
                    }
                    // 表示需要获取最新的标注数据
                    ass_api.getCurrentResult({
                        taskId: taskId,
                        markTaskId: pMarkTaskId,
                        markTaskFileId: file.index,
                        qtype: 'new',
                    }, function (info) {
                        var curInfo = self.parseResult(JSON.parse(info.resultText));
                        file.result = curInfo;
                        file.result.isBad = info.stamp;
                        file.isInit = 1;
                        // self.files.current.result = curInfo;
                        // self.files.current.result.isBad = info.stamp;
                        // self.files.current.isInit = 1;
                        self.files.currentPartNumber = curInfo.vads ? curInfo.vads.length : 0
                        if(!saveFirst){
                            file.lastSubmit ={result : JSON.stringify(curInfo),isLastAuto : info.isAutoSave == 1}
                            file.saveSuccess = true;
                        }
                    });
                },
                // 关闭
                closeResult:function () {
                    ass_api.closeResult(self.base.step);
                },
                // 视频标志 是否保存，是否坏数据
                getBadStyle:function () {
                    var result = {display:'none'};
                    if(self.history.showVersionInfo){
                        if(!isNull(self.history.current)){
                            result.display = 'block';
                            if(self.history.current.result.isBad){
                                result.background= '#fcad1d';
                            }
                        }
                    }else{
                        if(!isNull(self.files.current)){
                            if(self.files.current.status == 1){
                                result.display = 'block';
                            }
                            if(self.files.current.result.isBad){
                                result.background= '#fcad1d';
                            }
                        }
                    }
                    return result;
                },
                // 左侧列表栏 原点颜色
                getCurStyle2I: function (item) { // 导航中当前的标注状态
                    if (item.status == 0) {
                        return {background: '#cdd0cf'};
                    }
                    if(!item.saveSuccess){ // 保存失败
                        return {background:'indianred'};
                    }
                    if (item.result.isBad) {
                        return {background: '#fcad1d'};
                    }
                },
                // 左侧列表栏 文字颜色
                getCurStyle2Li:function (item) {
                    if(self.files.current.index == item.index){
                        return {color:'#000',fontWeight:'700'}; // 表示当前记录
                    }
                    if (item.status == 1) { // 表示已经保存
                        return {color: '#444'};
                    }
                },
                // 音频下原点颜色
                vadCss:function (pVad) {
                    // 当前播放的vad
                    if ((pVad -1) == this.files.partIndex) {
                        return "transmit crtplay";
                    }
                    return "greenCircle";
                },
                // 左侧序号颜色
                hasPlayerCss:function (item) { // 标号，表示已加载了player
                    return isNotNull(item.player) ?  {color:'#14cb6b'} : null;
                },
                // 提交
                submitResult:function () {
                    self.operate.isKeydownPrepare = false;
                    var len = self.files.all.length;
                    function skipUnSave(_p) {
                        if(self.files.showType != 1){
                            self.selectData(1);
                        }
                        self.skipFile(_p);
                    }
                    function prejudgeSubmit() {
                        for(var i = 0;i<len;i++){
                            var item = self.files.all[i];
                            if(item.status == 0){
                                ui.fade(item.name + ' 未完成标注,请完成标注后提交');
                                skipUnSave(item);
                                return false;
                            }
                            if(!item.saveSuccess){
                                ui.fade(item.name + ' 保存失败，不能完成提交');
                                skipUnSave(item);
                                return false;
                            }
                        }
                        return true;
                    }
                    if(self.base.step == 0){
                        self.saveResult(false,false,function () {
                            if(prejudgeSubmit()){
                                // 标注提交
                                ui.confirm('任务已完成，确认提交？', function () {
                                    ass_api.submitTask(markTaskId,'', function () {
                                        ui.fade("提交成功...");
                                        clearInterval(self.operate.autoSaveInterval);
                                        self.closeResult();
                                    });
                                });
                            }
                        },function (error) {
                            ass_api.error(error,self.base.step);
                        });
                        self.operate.isKeydownPrepare = true;
                    }else if(self.base.step == 1){
                        // 检查提交
                        self.saveResult(false,false,function () {
                            if(prejudgeSubmit()){
                                var tmpId = '_contentCheck',html = '<div class="popdis"><div class="con">\
                                        <label>评价:</label>\
                                        <textarea id='+tmpId+' placeholder="请输入评价" style="resize: none; height: 90px;width: 290px;"></textarea>\
                                    </div></div>';
                                ui.customDialogs('操作',html,{btnName:'提交',method:function(){
                                        var content = document.getElementById(tmpId).value;
                                        content = $.trim(content);
                                        if(content.length > 100 || content.length < 4){
                                            ui.fade('请输入规定范围文字个数4~100');
                                            return false;
                                        }
                                        ui.confirm('任务已完成，确认提交？', function () {
                                            ass_api.submitTask(markTaskId,JSON.stringify({isQualified:0,evaluate:content}),function () {
                                                ui.fade("提交成功...");
                                                clearInterval(self.operate.autoSaveInterval);
                                                self.closeResult();
                                            });
                                        });
                                        self.operate.isKeydownPrepare = true;
                                        return true;
                                    }},{btnName:'取消',method:function(){
                                        self.operate.isKeydownPrepare = true;
                                        return true;}});
                            }
                        },function (error) {
                            ass_api.error(error,self.base.step);
                        });
                    }else if(self.base.step == 2){
                        // 质检提交
                        self.saveResult(false,false,function () {
                            if(prejudgeSubmit()){
                                var isQualified = 0, tmpId = '_contentQuality', html = '<div class="popdis"><div class="con">\
                                        <label>质检结果:</label>\
                                        <ul class="radio"><li id="isQualified_0" class="selected" >合格</li><li id="isQualified_1" onclick="isQualified(1)">不合格</li></ul>\
                                        <label>评价:</label>\
                                        <textarea id='+tmpId+' placeholder="请输入评价" style="resize: none; height: 90px;width: 290px;"></textarea>\
                                    </div></div>';

                                ui.customDialogs('操作',html,{btnName:'提交',method:function(){
                                        var content = document.getElementById(tmpId).value;
                                        content = $.trim(content);
                                        if(content.length > 100 || content.length < 4){
                                            ui.fade('请输入规定范围文字个数4~100');
                                            return false;
                                        }
                                        ui.confirm('任务已完成，确认提交？', function () {
                                            ass_api.submitTask(markTaskId,JSON.stringify({isQualified:isQualified,evaluate:content}),function () {
                                                ui.fade("提交成功...");
                                                clearInterval(self.operate.autoSaveInterval);
                                                self.closeResult();
                                            });
                                        });
                                        self.operate.isKeydownPrepare = true;
                                        return true;
                                    }},{btnName:'取消',method:function(){
                                        self.operate.isKeydownPrepare = true;
                                        return true;
                                    }},function () {
                                    var isQualified_0 = document.getElementById('isQualified_0');
                                    var isQualified_1 = document.getElementById('isQualified_1');
                                    isQualified_0.onclick = function () {
                                        isQualified = 0;
                                        this.className = 'selected';
                                        isQualified_1.className='';
                                    };
                                    isQualified_1.onclick = function () {
                                        isQualified = 1;
                                        this.className = 'selected';
                                        isQualified_0.className='';
                                    };
                                });
                            }
                        },function (error) {
                            ass_api.error(error,self.base.step);
                        });
                    }
                },
                // 打回
                repulse:function(){ // 检查环节的打回操作
                    self.saveResult(false,false,function () {
                        self.operate.isKeydownPrepare = true;
                        var html = '<div class="popdis"><div class="con">\
                                <label>打回原因:</label>\
                                <textarea id="_contentRepulse" placeholder="请输入评价" style="resize: none; height: 90px;width: 290px;"></textarea>\
                            </div></div>';
                        ui.customDialogs('打回操作',html,{btnName:'提交',method:function(){
                                var content = $("#_contentRepulse").val();
                                content = $.trim(content);
                                if(content.length > 100 || content.length < 4){
                                    ui.fade('请输入规定范围文字个数4~100');
                                    return false;
                                }
                                ass_api.submitTask(markTaskId,JSON.stringify({isQualified:1,evaluate:content}),function () {
                                    ui.fade("打回成功...");
                                    self.closeResult();
                                });
                                self.operate.isKeydownPrepare = true;
                                return true;
                            }},{btnName:'取消',method:function(){
                                self.operate.isKeydownPrepare = true;
                                return true;
                            }});
                    },function (error) {
                        ass_api.error(error,self.base.step);
                    });
                },
                // 打开历史
                showHistory:function () {
                    self.history.list = [];
                    ass_api.getCurrentResult({
                        taskId:taskId,
                        markTaskId:markTaskId,
                        markTaskFileId: self.getFile().index,
                        qtype:'history'
                    },function (info) {
                        var len = info.history.length;
                        for(var i = 0;i < len;i++){
                            self.history.list.push(info.history[i]);
                        }
                    });
                    self.history.show = true;
                },
                viewVersion:function (info) { // 查看结果
                    self.history.show=false;
                    self.history.showVersionInfo = true;

                    var curInfo = self.parseResult(JSON.parse(info.resultText));
                    curInfo.isBad = info.stamp;
                    self.history.current = {result:curInfo};
                    self.refreshMark();
                },
                //数据处理
                parseResult:function (dResult) {
                    return dResult
                },
                //恢复历史
                recoverVersion:function (pInfo) { // 恢复到该版本
                    var result = null;
                    if(isNull(pInfo)){
                        result = self.history.current.result;
                    }else{
                        result = self.parseResult(JSON.parse(pInfo.resultText));
                        result.isBad = pInfo.stamp;
                    }
                    self.files.current.result = result;
                    self.refreshMark();
                    self.saveResult(true,true);// 同步手动
                    self.history.show=false;
                    self.history.showVersionInfo = false;
                },
                closeVersion:function(){
                    self.history.show=false;
                    self.history.showVersionInfo = false;
                    self.refreshMark();
                },
                // 获取宽度(暂时无用)
                getWidth:function(){
                    var dom = $('.wavesurfer-region')
                    var domTarget = $('.bar.markrole')
                    for (var i = 0;i < dom.length;i++){
                        var lastWidth = 0
                        var width = dom.eq(i).width()
                        if(i>0){
                            lastWidth = dom.eq(i-1).width()
                        }
                        domTarget.find('div').eq(i).width(width/2 + lastWidth/2)
                    }
                },
                // 头部数据展示样式
                getSelectClass: function (_type) {
                    var len = self.files.all.length,result = 'unclickable';
                    if(_type == 1){
                        result = '';
                    }else if (_type == 2) { // 有好数据
                        for(var i = 0;i<len;i++){
                            if(!self.files.all[i].result.isBad){
                                result = '';
                                break;
                            }
                        }
                    } else if (_type == 3) {
                        for(var i = 0;i<len;i++){
                            if(self.files.all[i].result.isBad){ // 有坏数据
                                result = '';
                                break;
                            }
                        }
                    } else if (_type == 4) {
                        for(var i = 0;i<len;i++){
                            if(self.files.all[i].status == 0){ // 有未标注
                                result = '';
                                break;
                            }
                        }
                    }
                    if(result != ''){
                        return result;
                    }
                    if (_type == self.files.showType) {
                        return 'selected';
                    }
                },
                // 数组删除特定元素
                removeArrElement:function(arr,key){
                    var index = arr.indexOf(key)
                    if (index > -1) {
                        arr.splice(index,1)
                    }
                    return arr
                },





























                refreshCurPlayer:function () {
                    var player = self.getCurPlayer();
                    if(isNull(player)) return;
                    player.reload();
                },
                play: function () {
                    var player = self.getCurPlayer();
                    if(isNull(player)) return;
                    if(player.isPlaying()){
                        player.pause();
                    }else{ // 有区域的播放区域，没有区域的播放全部
                        var end = player.getRegionEnd(),start = player.getRegionStart();
                        if(end == 0){
                            player.play();
                            return;
                        }
                        var curTime = player.currentTime();
                        if(curTime < self.players.errorRange || curTime > end - self.players.errorRange && curTime <= end+self.players.errorRange){ // 当前播放进度重新开始，或者处于区域的末尾300ms误差范围内
                            player.play(start,end); // 播放区域全部
                            return;
                        }
                        if(curTime >= start && curTime <= end -self.players.errorRange){
                            player.play(curTime,end); // 播放当前位置到区域结束
                            return;
                        }
                        if(curTime < start){
                            player.play(curTime,end); // 播放区域的左边
                            return;
                        }
                        if(curTime > end){ // 播放区域的右边
                            player.play();
                        }
                    }
                },
                end: function () { // 停止播放
                    self.prejudge(function () {
                        self.getCurPlayer().end();
                    });
                },
                isPlayed:function () {
                    if(self.files.current.isBad!= true && self.files.current.isPlayed != true){
                        ui.fade("请播放完当前音频再切换");
                        return false;
                    }
                    return true;
                },
                getCurPlayer:function () {
                    return self.files.current.player;
                },
                getFileName:function (item) { // 含有下载进度
                    return item.name;
                },
                prejudge:function (success) {
                    prejudgeM(function () {
                        success?success():'';
                    },function () {
                        return isNotNull(self.files.current);
                    },function () {
                        if(isNull(self.files.current.player) || !self.files.current.player.isReady){
                            ui.fade('当前音频未加载完成...');
                            return false;
                        }
                        return self.files.current.player.isReady;
                    },function () {
                        if(self.files.current.player.isPlaying()){
                            self.files.current.player.pause();// 本条暂停
                        }
                        return true;
                    })
                },
                refreshMark:function () {
                    self.operate.refresh ++;
                },
                jumpToNaigationName:function(item){ // 跳转到指定的记录位置
                    $("#navigation").mCustomScrollbar("scrollTo",'#na_'+item.index);
                },
            },
            watch:{
            },
            computed: {
                allNumber: function () { // 全部数据数量
                    return this.files.all.length
                },
                goodNumber: function () { //  好数据数量
                    var len = this.files.all.length,result = 0;
                    if(len == 0) return 0;
                    for(var i = 0;i<len;i++){
                        if(this.files.all[i].result.isBad == 0){
                            result ++;
                        }
                    }
                    return result;
                },
                badNumber: function () { // 坏数据数量
                    var len = this.files.all.length,result = 0;
                    if(len == 0) return 0;
                    for(var i = 0;i<len;i++){
                        if(this.files.all[i].result.isBad == 1){
                            result ++;
                        }
                    }
                    return result;
                },
                noMarkNumber: function () {
                    var len = this.files.all.length,result = 0;
                    if(len == 0) return 0;
                    for(var i = 0;i<len;i++){
                        if(this.files.all[i].status == 0){
                            result ++;
                        }
                    }
                    return result;
                },
                curFileName: function () { // 显示当前的文件名称
                    var file = this.getFile();
                    return isNotNull(file) ? file.name : '--';
                },
                curNum:function(){ // 显示当前是第几个
                    if(isNull(self.files.showList) || self.files.showList.length == 0 || isNull(self.files.current)){
                        return 0;
                    }
                    var len = self.files.showList.length;
                    for(var i = 0;i<len;i++){
                        if(self.files.showList[i].index == self.files.current.index){
                            return i+1;
                        }
                    }
                },
                finishNum:function () { // 查看标注完成个数
                    var len = this.files.all.length,result = 0;
                    if(len == 0) return '--';
                    for(var i = 0;i<len;i++){
                        if(this.files.all[i].status == 1){
                            result ++;
                        }
                    }
                    return result;
                },
                isBad:function () { // 当前是好坏数据
                    var file = this.getFile();
                    return isNotNull(file) ? file.result.isBad : false; // 默认是好数据
                },
                hasNext:function () {
                    var file= this.getFile();
                    if(isNull(file)) return false;
                    if(isNull(file.next)) return false;
                    return true;
                }
            },
            filters: {
                trim: function (pValue, len) { // 长度超过len进行截取操作
                    if (pValue == undefined) return '--';
                    if (isNull(len)) len = 10;
                    return pValue.length > len ? pValue.substring(0, len) + '...' : pValue;
                },
                toDateTime:function (_value) { // 时间转换器
                    if(_value == undefined) return '--';
                    return toDateTime(_value);
                }
            },
            components: {
                'mark-component':{
                    template:'<div class="mark-content">\n                                    ' +
                    '<ul class="mark-content-list"  v-if="currentData != null">\n                                        ' +
                    '                   <li v-for="(item,index) in currentData.result.vads" class="content-item clearfix" :class="{active:index === partIndex}">\n                                            ' +
                    '                       <div class="data-layer clearfix">\n                                                ' +
                    '                           <span class="list-number"><p class="number" @click="getParentFragment(index)">{{index}}</p></span>\n                                               ' +
                    '                           <div class="edit-area"  ref="mark-data" @click="nextShow(index)">{{item.rtxt}}</div>\n                                            ' +
                    '                           <textarea class="edit-area-textarea" :readonly ="item.isBad ===  0 ? false : true" v-model="item.rtxt" @blur="leaveShow(index)" @input="setHeight(index)"></textarea>'+
                    '                       </div>\n                                            ' +
                    '                       <div class="handle-layer">\n                                                ' +
                    '                           <span class="handle-common" @click="markConvert(1,index)">"1"转"一"</span>\n                                                ' +
                    '                           <span class="handle-common" @click="markConvert(2,index)">"100"转"一百"</span>\n                                                ' +
                    '                           <span class="handle-common" @click="markConvert(3,index)">"1"转"幺"</span>\n                                                ' +
                    '                           <span class="handle-common" @click="markBad(index,0)" v-if="item.isBad === 0">坏</span>\n' +
                    '                           <span class="handle-common" @click="markBad(index,1)" v-if="item.isBad === 1">好</span>' +
                    '                       </div>\n                                        ' +
                    '                   </li>\n                                    ' +
                    '               </ul>\n                                ' +
                    '</div>',
                    props:['currentData','partIndex'],
                    created:function(){
                    },
                    mounted:function(){
                        /*setTimeout(function () {
                            var dom = document.getElementsByClassName('edit-area')
                            for (var i = 0; i < dom.length; i++){
                                if (dom[i].contentEditable == 'true') {
                                    dom[i].contentEditable = "plaintext-only"
                                }
                            }
                        },1000)*/
                    },
                    methods:{
                        // 新增方法 显示textarea 隐藏div
                        nextShow: function (index) {
                            var dom = $('.edit-area').eq(index),
                                targetDom = $('.edit-area-textarea').eq(index),
                                height = dom.height() + 10
                            if (window.getSelection()) {
                                var Selection = window.getSelection(); // 创建selection
                                var anchorOffset = Selection.anchorOffset; // 保存当前偏移量
                                var focusOffset = Selection.focusOffset; // 获取光标位置
                                var anchorNode = Selection.anchorNode; // 获取当前的node 节点
                                var start = 0; // 开始
                                var end = 0; // 结束
                                var tdom = document.getElementsByClassName('edit-area-textarea')[index]
                                setTimeout(function () {
                                    anchorOffset > focusOffset ?  (start = focusOffset,end = anchorOffset) : (start = anchorOffset,end = focusOffset)
                                    if(tdom.setSelectionRange)
                                    {
                                        tdom.focus()
                                        tdom.setSelectionRange(start,end);
                                    }
                                    else if (tdom.createTextRange) {
                                        var range = tdom.createTextRange();
                                        range.collapse(true);
                                        range.moveEnd('character', end);
                                        range.moveStart('character', start);
                                        range.select();
                                    }
                                })
                            }
                            dom.css('display','none')
                            targetDom.css({display:'block',height:height})
                            $('.list-number').eq(index).css('height',height)
                            // targetDom.focus()
                        },
                        leaveShow: function(index) {
                            var dom = $('.edit-area').eq(index),
                                targetDom = $('.edit-area-textarea').eq(index);
                            dom.css('display','block')
                            targetDom.css('display','none')
                        },
                        setHeight: function (index) {
                            var targetDom = $('.edit-area-textarea').eq(index)
                            var height = targetDom[0].scrollHeight + 2
                            targetDom.css({height:height})
                        },
                        getParentFragment: function (index) {
                            this.$emit('getFragment',index)
                        },
                        // 转换
                        markConvert: function (type, index) {
                            // var value = this.$refs['mark-data'][index].innerHTML
                            var value = this.currentData.result.vads[index].rtxt
                            if (type === 1) { // 1 转 一
                                this.currentData.result.vads[index].rtxt = NumberToChineseChar(value);
                            }else if (type === 2) { // 转数字
                                this.currentData.result.vads[index].rtxt = NumberToChineseSound(value)
                            } else if (type === 3) { // 1 转 幺
                                this.currentData.result.vads[index].rtxt = NumberToChineseChar(value, true);
                            }
                            this.$emit('markConvert',type,index)
                        },
                        // 标注内容发生变化
                        changeData: function (event,index) {
                            event = event || window.event
                            // var data = this.currentData.result.vads[index].txt
                            this.currentData.result.vads[index].rtxt = event.target.innerText // event.target.innerHTML
                            if (event.target.children[0] !== undefined) { // 判断是否存在 生成的其他标签
                                event.target.removeChild(event.target.children[0])
                            }
                            firstAuto = 0; // 重置参数
                        },
                        // 标坏
                        markBad: function (index,type) {
                            if (!type) {
                                this.currentData.result.vads[index].rtxt = '坏'
                                this.currentData.result.vads[index].isBad = 1
                                this.currentData.result.vads[index].label.push('bad-audio')
                                if (this.checkAllBad()) { // 全部都是坏数据
                                    this.currentData.result.isBad = 1
                                    this.currentData.result.label.push('bad-audio')
                                    this.$emit('allBad')
                                }
                            }else { // 有一个好数据，整条数据就是好数据
                                this.currentData.result.vads[index].rtxt = this.currentData.result.vads[index].txt0
                                this.currentData.result.vads[index].isBad = 0
                                for (var i = 0; i < this.currentData.result.vads[index].label.length;i++){
                                    this.currentData.result.vads[index].label= this.$parent.removeArrElement(this.currentData.result.vads[index].label,'bad-audio')
                                }
                                this.currentData.result.isBad = 0
                                this.currentData.result.label = this.$parent.removeArrElement(this.currentData.result.label,'bad-audio')
                            }
                        },
                        // 查看全部子数据是否全部为坏数据
                        checkAllBad: function () {
                            var len = this.currentData.result.vads.length
                            var Bad = true // 默认全部是坏数据
                            for (var i = 0;i < len;i++){
                                if (this.currentData.result.vads[i].isBad === 0) { // 有一条好数据，则修改
                                    Bad = false
                                }
                            }
                            return Bad
                        }
                    }
                },
                'history-component':{
                    template:'<div class="mark-content">\n                                    ' +
                    '<ul class="mark-content-list"  v-if="currentData != null">\n                                        ' +
                    '                   <li v-for="(item,index) in currentData.vads" class="content-item clearfix" :class="{active:index === partIndex}">\n                                            ' +
                    '                       <div class="data-layer clearfix" style="width: calc(100% - 50px)">\n                                                ' +
                    '                           <span class="list-number"><p class="number" @click="getParentFragment(index)">{{index}}</p></span>\n                                               ' +
                    '                           <div class="edit-area" :contenteditable="false" ref="mark-data" @blur="changeData($event,index)" >{{item.rtxt}}</div>\n                                            ' +
                    '                       </div>\n                                            ' +
                    '                   </li>\n                                    ' +
                    '               </ul>\n                                ' +
                    '</div>',
                    props:['currentData','partIndex'],
                    created:function () {

                    },
                    methods:{
                        getParentFragment: function (index) {
                            this.$emit('getFragment',index)
                        },
                    }
                }
            }
        }
        var vm = new Vue({
            el: '#wrapper',
            data: {},
            components: {
                'my-component': Component,
            }
        });
    })
});