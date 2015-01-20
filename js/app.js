(function(){

	function rand(){
		return Math.round(Math.random()*9);
	}

	function shuffle(array) {
		// code from https://github.com/coolaj86/knuth-shuffle

		var currentIndex = array.length, temporaryValue, randomIndex ;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}

	function Piece(){
		this.top = 0;
		this.right = 0;
		this.bottom = 0;
		this.left = 0;
		this.isDummy = false;
		this.pass = false;
		this.seleted = false;
	}

	function Board(){
		var self = this;
		self.list = [];
		self.size = 3; // 3x3

		//method

		self.gen = function(dummy){
			self.list = []; // renew
			var p,i;
			for(i=0;i< Math.pow(self.size,2); i++){
				if(dummy){
					// gen dummy piece
					p = new Piece();
					p.isDummy = true;
				}else{
					// gen presolved piece
					p = new Piece();
					// bottom right always random
					p.right = rand();
					p.bottom = rand();
					// top match top piece
					p.top = !!parseInt(i/self.size)?self.list[i-self.size].bottom:rand();
					// left match left piece
					p.left = !!(i%self.size)?self.list[i-1].right:rand();        
				}
				self.list.push(p);
			}
		}

		self.shuffle = function(){
			shuffle(self.list);
		}

		self.check = function(){
			var allpass = true;
			self.list.forEach(function(p,i){
				if(p.isDummy){
					allpass = false;
				}else{
					p.pass = true;
					if(!!parseInt(i/self.size) && !self.list[i-self.size].isDummy){
						// has top
						if(p.top !== self.list[i-self.size].bottom){
							p.pass = false;
							self.list[i-self.size].pass = false;
						}           
					}
					if(!!(i%self.size) && !self.list[i-1].isDummy){
						// has left
						if(p.left !== self.list[i-1].right){
							p.pass = false;
							self.list[i-1].pass = false;
						}
					}
					if(!p.pass) allpass = false;
				}
			});

			return allpass;
		}

	}

	function tetravexCtrl($scope){
		$scope.b1 = new Board();
		$scope.b2 = new Board();
		$scope.win = false;

		var prev_select = null;
		$scope.select = function(p,i,b){
			if(!!prev_select){
				if(p.selected){ //unselect
					p.selected = false;
				}else{
					prev_select.p.selected =false;
					b.list[i] = prev_select.p;
					prev_select.b.list[prev_select.i] = p;
				}
				prev_select = null;
				$scope.win = $scope.b1.check();

			}else{
				if(!p.isDummy){
					p.selected = true;
					prev_select = {p:p,i:i,b:b};
				}
			}
		}

		$scope.reload = function(){
			prev_select = null;
			$scope.win = false;
			$scope.b1.gen(true);
			$scope.b2.gen();
			$scope.b2.shuffle();
		}

		$scope.cheat = function(){
			prev_select = null;
			$scope.win = false;
			$scope.b1.gen(true);
			$scope.b2.gen();
		}

		// init
		$scope.reload();

	}
	tetravexCtrl.$inject = ['$scope'];

	angular.module('app',[])
	.controller('tetravex',tetravexCtrl);
})();