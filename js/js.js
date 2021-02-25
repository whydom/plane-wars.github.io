window.onload = function(){
	var $stargame = $("#stargame")
	var $game = $("#game")
	var $starbtn = $("#starbtn")
	var $mp = $("#mp")
	var $score = $("#scorenum")
	
	
	var bodyW = $("body").width()
	var bodyH = $("body").height()
	var myplaneW = 85                     //我方飞机的宽度
	var myplaneH = 98                     //我方飞机的高度
	var smallW = 33                       //小飞机的宽度
	var smallH = 23                       //小飞机的高度
	var middleW = 75                      //中飞机的宽度
	var middleH = 93                      //中飞机的高度
	var bigW = 108                        //大飞机的宽度
	var bigH = 173                        //大飞机的高度
	var bulletW = 8                       //子弹的宽度
	var bulletH = 18                      //子弹的高度
	var gametop = 0                       //游戏界面滚动速度
	var bullets = []                      //定义一个数组存放子弹的
	var enemys = []                       //定义一个数字存放敌机的
	var control = 0                       //定义一个控制游戏频率的值
	var $over = $("#over")                 //获取gameover的框
	var t                                 //游戏定时器
	var score = 0                         //游戏初始分数
	var speed = 1                         //游戏初始速度
	
	
	$starbtn.on("click",function(){
		/* 开始界面消失 */
		$stargame.css("display","none")
		/* 游戏界面出现 */
		$game.css("display","block")
		/* 确定我方飞机出现的位置 */
		$mp.css({
			"left" : bodyW/2 - myplaneW/2,
			"bottom" : "10%"
		})
		/* 手动我方飞机的自由移动 */
		$mp.on("touchstart",function(e){
			e = e || event
			startW = e.targetTouches[0].clientX
			startH = e.targetTouches[0].clientY
			
			$mp.on("touchmove",function(e){
				e = e || event
				endW = e.targetTouches[0].clientX
				endH = e.targetTouches[0].clientY
				Pleft = endW - myplaneW/2
				Ptop =  endH - myplaneH/2
				Pleft = Pleft<0?0:Pleft;
				Pleft = Pleft>bodyW-myplaneW?bodyW-myplaneW:Pleft;
				Ptop = Ptop<0?0:Ptop,
				Ptop = Ptop>bodyH-myplaneH?Ptop>bodyH-myplaneH:Ptop
				$mp.css({
					"left" : Pleft,
					"top" : Ptop
				})
			})
		})
		
		/* 创建子弹函数 */
		function Bullet(_left,_top){
			this.$bullet = $('<img src="img/bullets.png">')
			this.$bullet.css({
				position: "absolute",
				left : _left,
				top : _top
			});
			$game.append(this.$bullet)
			this.move = function(){
				this.$bullet.css({
					top: this.$bullet.offset().top - 20
				})
			}
		}
		
		
		/* 创建敌机函数 */
		function Enemy(src,bsrc,_w,_h,hp,speed,score){
			this.src = src;
			this.bsrc = bsrc;
			this.w = _w;
			this.h = _h;
			this.hp = hp;
			this.speed = speed;
			this.score = score;
			
			this.$enemy = $('<img src='+ this.src +'>')
			this.$enemy.css({
				position: "absolute",
				left : Math.floor(Math.random()*((bodyW - this.w -
				100)-this.w)+this.w),
				top : -(_h)
			});
			$game.append(this.$enemy)
			
			this.move = function(){
				this.$enemy.css({
					top: this.$enemy.offset().top + this.speed
				})
			}
		}
		
		
		
		/* 游戏滚动 */
		t = setInterval(function(){
			control++
			$game.css({
				backgroundPosition:"0 " + gametop + "px"
			})
			gametop = gametop>=bodyH?0:gametop+1,
			
			/* 创建子弹存放在数组中 */
			bleft = $mp.offset().left + (myplaneW - bulletW)/2
			btop = $mp.offset().top
			if(control%5 == 0) bullets.push(new Bullet(bleft,btop))
			for(var i=0;i<bullets.length;i++){
				bullets[i].move()
				if(bullets[i].$bullet.offset().top < -18){
					bullets[i].$bullet.remove()
					bullets.splice(i,1)
				}
			}
			
			/* 创建敌机 */
			
			/* 小飞机的创建  */
			if(control%50 == 0) enemys.push(new Enemy(("img/smallplane.png"),("img/Sbom.gif"),smallW,smallH,1,3*speed,100))
			
			/* 中飞机的创建  */
			if(control%100 == 0) enemys.push(new Enemy(("img/middleplane.png"),("img/Mbom.gif"),middleW,middleH,5,2*speed,500))
			
			/* 大飞机的创建  */
			if(control%150 == 0) enemys.push(new Enemy(("img/bigplane.png"),("img/Bbom.gif"),bigW,bigH,8,1*speed,1000))
			
			for(var i=0;i<enemys.length;i++){
				enemys[i].move()
				if(enemys[i].$enemy.offset().top > (bodyH + enemys[i].h)){
					enemys[i].$enemy.remove()
					enemys.splice(i,1)
				}
			}
			
			/* 碰撞检测 */
			for(var i=0;i<bullets.length;i++){
				var bleft = bullets[i].$bullet.offset().left              //子弹的左边距
				var btop = bullets[i].$bullet.offset().top                //子弹的上边距
				
				
				for(var k=0;k<enemys.length;k++){
					var mpleft = $mp.offset().left                          //我方飞机的左边距
					var mptop = $mp.offset().top                            //我方飞机的上边距
					var eleft = enemys[k].$enemy.offset().left              //敌机的左边距
					var etop = enemys[k].$enemy.offset().top                //敌机的上边距
					var eW = enemys[k].w                                    //敌机的宽度
					var eH = enemys[k].h                                    //敌机的高度
					
					/* 判断我方飞机是否有碰撞 */
					if(eleft>=(mpleft-eW) && eleft<=(mpleft+myplaneW) && etop>=(mptop-eH + 50 ) && etop<=(mptop+myplaneH)){
						$over.css("display","block")
						clearInterval(t)
					}
					
					/* 判断是否有击中敌机 */
					if(bleft>=(eleft-bulletW) && bleft<=(eleft+eW) && btop>=(etop-bulletH) && btop<=(etop+eH)){
						bullets[i].$bullet.remove()
						bullets.splice(i,1)
						enemys[k].hp--
						if(enemys[k].hp == 0){ 
							/* 更新分数 */
							score += enemys[k].score
							$("#scorenum").html(score)
							/* 变更速度 */
							if(score >=100000){
								speed = 2
							}
							if(score >=300000){
								speed = 3
							}
							if(score >=600000){
								speed = 4
							}
							
							
							/* 更换爆炸图片 */
							enemys[k].$enemy.attr("src",enemys[k].bsrc)
							var _enemy = enemys[k].$enemy
							/* enemys[k].$enemy.remove() */
							enemys.splice(k,1)
							setTimeout(function(){
								_enemy.remove()
								
							},500)
							
						}
						
					}
				}
			}
			
			
		},40)
		
	})
}