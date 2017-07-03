/**
 * Created by mac on 2017/6/11.
 */
(function(){
    window.Carrousel=function Carrousel (ul,num,lock) {
        this.carousel = ul;
        this.imageLis = ul.getElementsByTagName("li");
        this.circle = ul.getElementsByTagName("span");
        this.idx = 0;	//当前中间图片
        this.next = 1;	//下一张
        this.prev = num;	//上一张
        this.windowWidth=document.documentElement.clientWidth;
        this.timer=null;
        this.lock=lock;
        //console.log(this.windowWidth);
        //初始化
        this.init = this.init();
        //console.log(this.windowWidth);
        //window.onresize =this.reset();
        //console.log(this.circle[0]);
    }

    //屏幕尺寸改变重新执行初始化

   //Carrousel.prototype.reset=function (){
   //    var carousel=this.carousel;
   //    var imageLis=this.imageLis;
   //   his.init();
   //}
   Carrousel.prototype.init= function (){
       var windowWidth=this.windowWidth;
       var imageLis=this.imageLis;
       var carousel=this.carousel;
       var idx = this.idx;	//当前中间图片
       var next = 1;	//下一张
       var prev = this.prev;	//上一张
       var circle=this.circle;
       //设置盒子的高度
       //imageLis[idx].style.transition = "none";
       //imageLis[next].style.transition = "none";
       //imageLis[prev].style.transition = "none";
       //console.log(circle[0]);
       carousel.style.height = windowWidth * (340 / 666) + "px";
       for(var i =0; i<imageLis.length;i++){
           imageLis[i].style.transition="none";
           imageLis[i].style.transform = "translateX(" + 0 + "px)";
           circle[i].style.right=12*i+"px";
               }
       //设置li的默认位置
       for(var i = 1 ; i < imageLis.length ; i++){
           imageLis[i].style.transition="none";
           imageLis[i].style.transform = "translateX(" + windowWidth + "px)";
       }
       //imageLis[idx].style.transition = "none";
       //imageLis[next].style.transition = "none";
       //imageLis[prev].style.transition = "none";
       //imageLis[idx].style.webkitTransform = "translateX(0px)";
       //imageLis[next].style.webkitTransform = "translateX(" + windowWidth + "px)";
       //imageLis[prev].style.webkitTransform = "translateX(" + -windowWidth + "px)";
       this.create=this.create();

    }
    Carrousel.prototype.create=function (){
        var idx = this.idx;	//当前中间图片
        var next = 1;	//下一张
        var prev = this.prev;	//上一张
        var windowWidth=this.windowWidth;
        var carousel=this.carousel;
        var imageLis=this.imageLis;
        var num= this.prev;
        var circle=this.circle;
        //事件监听
        carousel.addEventListener("touchstart",touchstartHandler,false);
        carousel.addEventListener("touchmove",touchmoveHandler,false);
        carousel.addEventListener("touchend",touchendHandler,false);

        carousel.style.height = windowWidth * (340 / 666) + "px";

        //手指的偏移量
        var deltaX;
        //触摸开始时候的手指位置
        var startX;
        //时间戳，从1970年1月1日0:00到现在的毫秒数
        var startTime;
        //定时器
        if(this.lock){
        this.timer = setInterval(function(){
            showNext();
        },8000);
        }

        //事件处理函数
        function touchstartHandler(event){
            //阻止默认事件
            event.preventDefault();
            //手指个数
            if(event.touches.length > 1){
                return;
            }

            clearInterval(this.timer);

            //记录偏移量
            deltaX = event.touches[0].clientX;
            //记录手指位置
            startX = event.touches[0].clientX;
            //去掉过渡，移动的时候我希望实时跟随鼠标，而不是有过渡效果
            imageLis[idx].style.transition = "none";
            imageLis[next].style.transition = "none";
            imageLis[prev].style.transition = "none";
            //记录时间戳
            startTime = new Date();

            //就位（这个事儿没有必要，纯粹为了防穿帮）
            imageLis[idx].style.webkitTransform = "translateX(0px)";
            imageLis[next].style.webkitTransform = "translateX(" + windowWidth + "px)";
            imageLis[prev].style.webkitTransform = "translateX(" + -windowWidth + "px)";
        }
        //手指移动的时候
        function touchmoveHandler(event){
            //阻止默认事件
            event.preventDefault();
            //手指个数
            if(event.touches.length > 1){
                return;
            }
            //清除定时器
            clearInterval(this.timer);
            //this.lock=false;

            //得到坐标
            var clientX = event.touches[0].clientX;
            //改变图片的位置
            imageLis[idx].style.webkitTransform = "translateX(" + (clientX - deltaX) + "px)";
            imageLis[next].style.webkitTransform = "translateX(" + (windowWidth + clientX - deltaX) + "px)";
            imageLis[prev].style.webkitTransform = "translateX(" + (-windowWidth + clientX - deltaX) + "px)";
        }
        //手指结束触摸的时候
        function touchendHandler(event){
            //阻止默认事件
            event.preventDefault();

            //决断滑动是否成功
            var distance = event.changedTouches[0].clientX - startX;
            //滑动的时间
            var time = new Date() - startTime;

            //如果你像右边滑动超过了屏幕的一半，或者你向右边滑动且时间小于500，就认为滑动成功
            if(distance >= windowWidth / 2 || (distance > 30 && time < 300)){
                //向右边滑动成功
                //console.log("向右边滑动成功")
                //先改变信号量
                next = idx;
                idx = prev;
                //改变next
                prev--;
                if(prev < 0){
                    prev = num;
                }
                //加上过渡
                imageLis[idx].style.transition = "all 0.3s ease 0s";
                imageLis[next].style.transition = "all 0.3s ease 0s";
                //移动
                imageLis[idx].style.webkitTransform = "translateX(0px)";
                imageLis[next].style.webkitTransform = "translateX(" + windowWidth + "px)";
                //for(var i =0;i <= circle.length;i++){
                //    circle[i].className="";
                //}
                //circle[idx-1].className="active";

            }else if(distance <= -windowWidth / 2 || (distance < -30 && time < 300)){
                showNext();
            }else{
                //绝对值不到windowWidth/2，  滑动不成功

                //加上过渡
                imageLis[prev].style.transition = "all 0.3s ease 0s";
                imageLis[idx].style.transition = "all 0.3s ease 0s";
                imageLis[next].style.transition = "all 0.3s ease 0s";

                //移动
                imageLis[prev].style.webkitTransform = "translateX(" + -windowWidth + "px)";
                imageLis[idx].style.webkitTransform = "translateX(0px)";
                imageLis[next].style.webkitTransform = "translateX(" + windowWidth + "px)";
            }

            clearInterval(this.timer);
            //开始定时器
            this.timer = setInterval(function(){
                showNext();
            },8000);
        }

        function showNext(){
            //向左边滑动成功
            //console.log("向左边滑动成功")
            //先改变信号量
            prev = idx;
            idx = next;
            //改变next
            next++;
            if(next > num){
                next = 0;
            }

            //
            imageLis[next].style.transition = "none";
            imageLis[next].style.webkitTransform = "translateX(" + windowWidth + "px)";

            //加上过渡
            imageLis[prev].style.transition = "all 0.3s ease 0s";
            imageLis[idx].style.transition = "all 0.3s ease 0s";
            //移动
            imageLis[prev].style.webkitTransform = "translateX(" + -windowWidth + "px)";
            imageLis[idx].style.webkitTransform = "translateX(0px)";
            //console.log(circle[0])
            //for(var i =0;i <= circle.length;i++){
            //    circle[i].style.background="#ccc";
            //}
            //var cidx=idx-1;
            //circle[cidx].style.background="f55";
            //
            //console.log(circle[0].className);
        }
    }
})()