
var activity = new Vue({
    el:"#main",
    data:{
       totalData:[],
        fixedData:[],
       show:false,
        //页面title
        title:"",
        navListActiveIndex:0,
        fullScreen:false,
        fullScreenImg:[],
        exampleOne:'',
        fullScreenBanner:'',
        clientHeight:document.documentElement.clientHeight -4,
        clientWidth :document.documentElement.clientWidth
    },
    created:function(){
        this.getData();

    },
    methods:{
          getData:function(){
              var prama = this.getUrlParam("id");
              var url = "https://m.cf139.com/news/activity/" + prama;
              var _this = this;
              axios.get(url)
                  .then(function (response) {
                      if(response.data.code == 200){
                          _this.totalData = response.data.ch_msg[0].components;
                          _this.title = response.data.ch_msg[0].name;
                          _this.getTitle( _this.title)
                          _this.totalData.sort(function(a,b){
                              return   a.type -b.type;
                          });
                          // console.log(_this.totalData)
                          _this.$nextTick(function () {
                              _this.initTswiper();
                              _this.initFswiper();
                          })
                          _this.getFullScreen(_this.totalData)

                      }
                  })
                  .catch(function (error) {
                      console.log(error);
                  });
          },
        /**
         * 获取全屏数据 及 案例数据 及 固定底部数据
         * @param data
         */
        getFullScreen:function(data){
            var _this = this;
            for(var i in data){
                var mode = data[i].mode;
                if(data[i].type == "1"){
                    if(mode == '1'){
                        _this.fullScreen = true
                        _this.fullScreenBanner = data[i].img+'?imageView2/1/w/'+_this.clientWidth+'/h/'+_this.clientHeight+'/q/90';
                    }
                }else if(data[i].type == "4"){
                    this.exampleOne = data[i]
                }else if(data[i].type == '2'){
                    _this.fullScreenImg = data[i].componentImgs
                }else if(data[i].type == '5'){
                    _this.fixedData = data[i]
                    console.log(_this.fixedData)
                }
            }


        },
        /**
         * 案例数据切换
         * @param event
         */
        changeBackone:function(event){
          this.navListActiveIndex = 0
          var target = event.target
          var color = this.exampleOne.componentImgs[0].color
           target.setAttribute('style','background-color:'+ color)
           target.nextSibling.setAttribute('style','color:'+ color +';background-color:#fff;border-color:'+color)
          
        },
        changeBacktwo:function(event){
          this.navListActiveIndex = 1
           var target = event.target
            var color = this.exampleOne.componentImgs[1].color
            target.previousSibling.setAttribute('style','color:'+ color +';background-color:#fff;border-color:'+ color)
           target.setAttribute('style','background-color:'+ color);
        },
        /**
         * 获取prama
         * @param name
         * @returns {*}
         */
        getUrlParam:function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg); //匹配目标参数
            if (r != null) return unescape(r[2]); return null; //返回参数值
        },
        getTitle:function(title){
            document.title = title;
        },
        /**
         * 弹窗切换
         */
        popupShow:function(){
            this.show = true
        },
        hidePopup:function(){
            this.show = false
        },
        initFswiper:function(){
            fiveSwiper = new Swiper ('.fiveImgs', {
                watchSlidesProgress: true,
                slidesPerView: 'auto',
                centeredSlides: true,
                loop: true,
                loopedSlides: 5,
                autoplay: true,
                stopOnLastSlide: false,
                autoplayDisableOnInteraction: false,
                on: {
                    progress: function(progress) {
                        for (i = 0; i < this.slides.length; i++) {
                            var slide = this.slides.eq(i);
                            var slideProgress = this.slides[i].progress;
                            modify = 1;
                            if (Math.abs(slideProgress) > 1) {
                                modify = (Math.abs(slideProgress) - 1) * 0.12 + 1;
                            }
                            translate = slideProgress * modify * 2.2 + 'rem';
                            scale = 1 - Math.abs(slideProgress) / 5;
                            zIndex = 999 - Math.abs(Math.round(10 * slideProgress));
                            slide.transform('translateX(' + translate + ') scale(' + scale + ')');
                            slide.css('zIndex', zIndex);
                            slide.css('opacity', 1);
                            if (Math.abs(slideProgress) > 3) {
                                slide.css('opacity', 0);
                            }
                        }
                    },
                    setTransition: function(transition) {
                        for (var i = 0; i < this.slides.length; i++) {
                            var slide = this.slides.eq(i)
                            slide.transition(transition);
                        }

                    }
                }

            })
        },
        initTswiper:function () {
            threeSwiper = new Swiper('.threeImgs',{
                watchSlidesProgress: true,
                slidesPerView: 'auto',
                slideToClickedSlide:true,
                centeredSlides: true,
                loop: true,
                loopedSlides: 3,
                // autoplay: true,
                on:{
                    progress: function(progress) {
                        for (i = 0; i < this.slides.length; i++) {
                            var slide = this.slides.eq(i);
                            var slideProgress = this.slides[i].progress;
                            modify = 1;
                            if (Math.abs(slideProgress) > 1) {
                                modify = (Math.abs(slideProgress) - 1) * 0.3 + 1;
                            }
                            translate = slideProgress * modify * 5.5 + 'rem';
                            scale = 1 - Math.abs(slideProgress) / 7;
                            zIndex = 999 - Math.abs(Math.round(10 * slideProgress));
                            slide.transform('translateX(' + translate + ') scale(' + scale + ')');
                            slide.css('zIndex', zIndex);
                            slide.css('opacity', 1);
                            if (Math.abs(slideProgress) > 3) {
                                slide.css('opacity', 1);
                            }
                        }
                    },
                    setTransition: function(transition) {
                        for (var i = 0; i < this.slides.length; i++) {
                            var slide = this.slides.eq(i);
                            slide.transition(transition);
                        }

                    }
                }

            })
        }
    }
})

