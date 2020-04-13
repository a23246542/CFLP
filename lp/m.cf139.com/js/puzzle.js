(function($) {
    /**
     * {String} src 图片路径
     * {int} cols 列数
     * {int} rows 行数
     * {int} rand 打散步数
     */
    $.fn.hsPintu = function(src, cols, rows, rand) {
        var that = $(this);
        var srz  = that.data("src");
        var img  = that.data("img");
        var aw = that.width ();//宽
        var ah = that.height();//高
        var ew = aw / rows;//每一行的宽度
        var eh = ah / cols;//每一列的高度

        // 状态: 0 进行中, 1 成功, 2 结束
        that.data("hsPintuStatus", 2);
        that.data("cols", cols);
        that.data("rows", rows);

        /**
         * img 存在且 src 没变化
         * 则不需要再次加载图片
         * 直接取出存储好的数据
         */
        if (img && srz === src) {
            var ox = that.data("pos_x");
            var oy = that.data("pos_y");
            //console.log("Note: 图片无变化");
            split(that, cols, rows, ew, eh, ox, oy, img );

            // 未给 rand 则仅拆分而不打散
            if (rand === undefined) return;

            upset(that, cols, rows, rand);
            that.data("hsPintuStatus", 0);
            that.trigger("hsPintuLaunch");
        } else
            loadr(src, aw, ah, function(ox, oy) {
                that.data("src", src );
                that.data("img", this);
                that.data("pos_x", ox);
                that.data("pos_y", oy);
                //console.log("Note: 载入新图片");
                split(that, cols, rows, ew, eh, ox, oy, this);
                // 未给 rand 则仅拆分而不打散
                if (rand === undefined) return;
                upset(that, cols, rows, rand);
                that.data("hsPintuStatus", 0);
                that.trigger("hsPintuLaunch");
            });

        // 已经初始化过就不要再绑定事件了
        if (! that.data("hsPintuInited")) {
            that.data("hsPintuInited", 1);

            that.on("click", "._pt-pic:not(._pt-pix)", function() {
                if (that.data("hsPintuStatus") === 0) {
                    var cols =that.data("cols");
                    var rows =that.data("rows");
                    var hole =that.children("._pt-pix");
                    if (mover(that, cols, rows, hole, $(this))) {
                        that.data("hsPintuStatus", 1);
                        that.trigger("hsPintuFinish");
                    }
                }
            });
        }
        return  this;
    };

    /**
     * 预载文件
     */
    $.fn.hsFileLoad = function(cal) {
        this.each(function() {
            var that = this;
            if (window.FileReader) {
                var fr = new FileReader( );
                fr.onloadend = function(e) {
                    cal.call(that, e.target.result);
                };  cal.call(that);
                $.each( this.files, function(i, fo) {
                    fr.readAsDataURL( fo );
                });
            } else
            if (this.getAsDataURL) {
                cal.call(that, that.getAsDataURL());
            } else {
                cal.call(that, that.value);
            }
        });
        return this;
    };
    /**
     * 加载图片
     *  cal 的回调参数为:
     *  ox 横向偏移
     *  oy 纵向偏移
     *  this 指向载入的图片的 jQuery 对象
     *  {String} src 图片路径
     *  {int} w 额定宽
     *  {int} h 额定高
     *  {Fucntion} cal 加载完成后的回调方法

     */
    function loadr(src, w, h, cal) {
        var img  =  new Image();
        img.onload = function() {
            var xw = img.width ;
            var xh = img.height;
            var zw = xh * w / h;
            if (zw > xw) {
                // 宽度优先
                img.width   = w;
                img.height  = xh * w / xw;
                xh = (h - img.height) / 2;
                xw = 0;
            } else {
                // 高度优先
                img.height  = h;
                img.width   = xw * h / xh;
                xw = (w - img.width ) / 2;
                xh = 0;
            }

            cal.call(img, xw, xh);
        };
        img.src = src ;
    }

    /**
     * 拆分图片
     *  {jQuery} that 容器对象
     *  {int} cols 行
     *  {int} rows 列
     *  {int} ew 板块宽度
     *  {int} eh 板块高度
     *  {int} ox 图片横向偏移
     *  {int} oy 图片纵向偏移
     *  {Image} im 图片对象
     */
    function split(that, cols, rows, ew, eh, ox, oy, im) {
        that.empty();

        for(var j = 0 ; j < rows; j ++) {
            for(var i = 0 ; i < cols; i ++) {
                var k = i + j * rows;
                var pic = $('<div class="_pt-pic"></div>');
                pic.attr("id", "_pt-pic-"+k);
                pic.data("idx", k);
                pic.appendTo(that);
                pic.css ({
                    "position": "relative",
                    "overflow": "hidden",
                    "border"  : "0",
                    "width"   : ew + "px",
                    "height"  : eh + "px"
                });

                var img = $(im.cloneNode());
                img.appendTo(pic);
                img.css ({
                    "position": "absolute",
                    "z-index" : "88",
                    "border"  : "0",
                    "left"    : (1 - i * ew + ox) + "px",
                    "top"     : (1 - j * eh + oy) + "px"
                });

                // 因边框可能影响宽高计算, 故边框单独用一个块来放
                var bor = $('<div class="_pt-bor"></div>');
                bor.appendTo(pic);
                bor.css ({
                    "position": "absolute",
                    "z-index" : "99",
                    "width"   : ew*1.5 + "px",
                    "height"  : eh*1.5 + "px"
                });
                // 由于样式宽高并不含边框, 故再次计算尺寸的偏移量
                bor.css ({
                    "width"   : (2 * bor.width () - bor.outerWidth ()) + "px",
                    "height"  : (2 * bor.height() - bor.outerHeight()) + "px"
                });
                var W_w=ew*3 + "px",
                    H_h =eh*3 + "px",
                    H_con=eh*3.8 + "px";
                $('#_pt-box').css({"width":W_w,"height":H_h});
                $('._container').css("height",H_con)
            }
        }
    }

    /**
     * 打散图片
     * {jQuery} that 容器对象
     *  cols 列
     *  rows 行
     *  rand 打散步数
     */
    function upset(that, cols, rows, rand) {
        var v ;
        var r = Math.floor(Math.random()  *  cols  *  rows);
        var hole = that.children().eq(r).addClass("_pt-pix");
        var part ;
        var step = [];
        var dbug = [];
        for(var  i = 0, j = rand; i < j; i ++) {
            var  x = cols - 1;
            var  y = rows - 1;
            var  z = cols;
            var rx = r % cols;
            var ry = Math.floor(r / cols);
            var rv = [];

            if (rx > 0 && rx < x) {
                rv.push(r - 1, r + 1); // 可左右移动
            } else
            if (rx > 0) {
                rv.push(r - 1); // 可向左移动
            } else
            {
                rv.push(r + 1); // 可向右移动
            }
            if (ry > 0 && ry < y) {
                rv.push(r - z, r + z); // 可上下移动
            } else
            if (ry > 0) {
                rv.push(r - z); // 可向上移动
            } else
            {
                rv.push(r + z); // 可向下移动
            }

            // 排除来源位置
            if (step.length > 0) {
                v = step[step.length - 1];
                v = $.inArray(v, rv);
                if (v > -1) {
                    rv.splice(v, 1 );
                }
            }
            // 排除回旋位置
            if (step.length > 1 && rv.length > 1) {
                v = step[step.length - 2];
                v = $.inArray(v, rv);
                if (v > -1) {
                    rv.splice(v, 1 );
                }
            }

            // 随机方向
            r = rv[Math.floor(Math.random()* rv.length)];
            v = hole.index();
            step.push(v);

            // 交换位置
            part  = that.children().eq( r );
            if (r < v) {
                part.insertBefore(hole);
                hole.insertBefore(that.children().eq(r));
            } else {
                hole.insertBefore(part);
                part.insertBefore(that.children().eq(v));
            }

            // 调试步骤
            if (r == v + 1) {
                dbug.push("左");
            } else
            if (r == v - 1) {
                dbug.push("右");
            } else
            if (r > v) {
                dbug.push("上");
            } else
            if (r < v) {
                dbug.push("下");
            }
        }

        // 攻略
        dbug = dbug.reverse().join(" "); //alert(dbug);
        /*console.log( "攻略: "+dbug+"\r\n此非最优解, 仅为随机打散时的逆向步骤, 上下左右为相对缺口的板块, 祝您玩的开心!" );*/
    }

    /**
     * 移动板块
     * @param {jQuery} that 容器对象
     * @param {int} cols 列数
     * @param {int} rows 行数
     * @param {jQuery} hole 缺口对象
     * @param {jQuery} part 板块对象
     */
    function mover(that, cols, rows, hole, part) {
        var move = false ;
        var i  = part.index();
        var j  = hole.index();
        var ix = i % cols;
        var jx = j % cols;
        var iy = Math.floor(i / cols);
        var jy = Math.floor(j / cols);

        if (iy == jy) { // 在同一行
            move  = ix == jx + 1  // 可向左边移动
                || ix == jx - 1; // 可向右边移动
        } else
        if (ix == jx) { // 在同一列
            move  = iy == jy + 1  // 可向上移动
                || iy == jy - 1; // 可向下移动
        }

        // 互换位置
        if (move) {
            if (i  <  j ) {
                part.insertBefore(hole);
                hole.insertBefore(that.children().eq(i));
            } else {
                hole.insertBefore(part);
                part.insertBefore(that.children().eq(j));
            }
        }

        // 判断是否拼图完成
        move = true;
        for (i = 0, j = cols * rows; i < j; i ++) {
            if (that.children().eq(i).data("idx") != i) {
                move = false;
            }
        }

        return  move;
    }
})(jQuery);
(function($) {
    var cols = 3;
    var rows = 3;
    var rand = 3;
    var srcs = [
        "images/D1-dj/pt.jpg",
        "images/D1-dj/pt.jpg",
        "images/D1-dj/pt.jpg",
        "images/D1-dj/pt.jpg"
    ];
    var src  = srcs[Math.floor(Math.random() * srcs.length)];
    var box  = $("#_pt-box");
    var tmr;
    var sec;

    function launch( ) {
        box.data("hsPintuStatus", 0);
        if (tmr) clearInterval (tmr);
        $("._dt").hide();
        $("._qt").show();
        $("._bt-start").addClass("_bt-timer");
        //$("._bt-timer").css("background-image", "url(img/timer.gif?_="+Math.random()+")");
    }

    function finish(s) {
        box.data("hsPintuStatus", s);
        if (tmr) clearInterval (tmr);
        $("._dt").show();
        $("._qt").hide();
        $("._bt-start").removeClass("_bt-timer");
        $("._bt-start").css("background-image", "none");
    }

    function dialog(o) {
        if (!o) {
            $("#_overlay").hide();
            $("#cabinet").hide();
            return;
        }
        $("#_overlay").show();
        $("#cabinet").show();
        $("#dialog" ).show();
        $("#guider" ).hide();
        $("#dialog .dl-txt").html(o.msg);
        if (o.fn0) {
            $("#dialog ._bt-fn0").text(o.fn0.txt);
            $("#dialog ._bt-fn0").data("cal", o.fn0.cal);
        }
        if (o.fn1) {
            $("#dialog ._bt-fn1").text(o.fn1.txt);
            $("#dialog ._bt-fn1").data("cal", o.fn1.cal);
        }
    }

    $("._qt" ).show();
    $("#dialog ._bt-fn1").text("炫耀一下");
    $("#dialog ._bt-fn1").data("cal", function() {
        $("#dialog").show();
        $("#guider").show();
    });
    $("._bt-fn0,._bt-fn1").click(function(evt) {
        $(this).data("cal").call(this , evt);
    });
    dialog(null);

    // 开始事件
    box.on("hsPintuLaunch", function() {
        launch();
        sec = 0 ;
        $("#_dt-sec").text( sec );
        tmr = setInterval(function() {
            sec ++;
            $("#_dt-sec").text( sec );
//                        if (sec > 59) {
//                            finish(2); // 到期终止
//                            alert ("时间到");
//                        }
        }, 1000);
    });

    // 结束事件
    box.on("hsPintuFinish", function() {
        var sez = sec;
        finish(1);
        if (sez <= 60) {
            var num = Math.floor(Math.random() * 10) % 2 == 0 ? 20 : 30;
            dialog({
                msg: '恭喜您,拼图成功, 用时<span class="dl-red">'+sez+'</span>秒<br />',
                fn0: {
                    txt: "结束游戏 ",
                    cal: function() {
                        location.href = "supercar-dj.html#"+num;
                    }
                }
            });
        } else {
            dialog({
                msg: '挑战失败, 用时<span class="dl-red">'+sez+'</span>秒',
                fn0: {
                    txt: "再来一次",
                    cal: function() {
                        dialog( null );
                        $("._bt-again").click();
                    }
                }
            });
        }

        var _over = $('#_overlay');
        var _cabinet = $('#cabinet');

        _over.click(function () {
            _over.hide();
            _cabinet.hide();
            box.hsPintu(src, cols, rows);
        });
        var _overicon = $('._icon');
        _overicon.click(function(){
            _over.hide();
            _cabinet.hide();
            box.hsPintu(src, cols, rows);
        });
        /*share();*/
    });

    // 选图
    $("._bt-thumb").click(function() {
        $("._bt input[type=file]").click();
    });
    $("._bt input[type=file]").change(function() {
        $(this).hsFileLoad(function(url) {
            if (! url) return;
            src = url; // 本地图片
            finish(2); // 重新开始
            box.hsPintu(src, cols, rows);
        });
    });

    // 开始
    $("._bt-start").click(function() {
        if($(this).is("._bt-timer")) {
            return;
        }
        finish( 2); // 清除计时
        box.hsPintu(src, cols, rows, rand);
    });

    // 重来
    $("._bt-again").click(function() {
        rand += 3 ; // 加大难度
        finish( 2); // 重新开始
        box.hsPintu(src, cols, rows);
    });

    // 初始化
    box.hsPintu(src, cols, rows);

    // 假装很多人玩, 不然太冷清了
    function tp() {
        var num = Math.floor(Math.random() * 10) % 2 == 0 ? 20 : 30;
        var tel = Math.floor(Math.random() * 10000);
        tel = tel + "";
        for (var i = 0, j = 4 - tel.length; i < j; i ++) {
            tel = "0" + tel;
        }
        $("#tp-tel").text(tel);
        $("#tp-num").text(num);
        // 闪烁
        var spn = $("#tp-tel,#tp-num");
        var co1 = spn.css('color');
        var co2 = "#ffde75" ;
        setTimeout(function() {
            spn.css("color" , co2);
            setTimeout(function() {
                spn.css("color" , co1);
                setTimeout(function() {
                    spn.css("color" , co2);
                    setTimeout(function() {
                        spn.css("color" , co1);
                    }, 200);
                }, 200);
            }, 200);
        }, 200);

        setTimeout(tp, (Math.floor(Math.random() * 5) + 5) * 1000 );
    }
    tp();
})(jQuery);