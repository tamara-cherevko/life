$(function() {
    var Life = function(){
        this.playState = 0 // 0 - pause, 1 - play
        this.complication = 20; // 10, 20, 30..ex 
        this.playInterval = null;
        this.gameOver = 0;
        /**
         * @private
         * @method _createBoard
         * @description  
         */        
        this._createBoard = function(){
            var i = 0, j , tr,
                complication = this.complication;                
            
            for(i; i < complication; i++){
                $("#Life").append("<tr>");
                tr = $("#Life tr").eq(i);
                for(j = 0; j < complication; j++){                    
                    $("<td>").addClass("ded").appendTo(tr);
                }
            }
            
            (function setCellState(){
                $("#Life tr").each(function(){
                    $(this).find("td").each(function(){              
                        $(this).data("state", "ded");
                    });
                });  
            })();    
        }
        /**
         * @private
         * @method _addEvents
         * @description  
         */        
        this._addEvents = function(){
            var _this = this;
            $("#Life tr").each(function(){
                $(this).find("td").each(function(index){              
                    $(this).data("position", index);
                });
            });    
            $("#Life td").bind("click", function(){
                if(!_this.playState){
                    var state = $(this).data("state");                
                    state = state === "ded" ? "live" : "ded";                
                    $(this).data("state", state);
                    $(this).attr("class", state);
                }
                
                return false;                
            });
            $("#Play").bind("click", function(){                 
                if(!_this.playState){
                    _this.play();  
                    _this.playState = 1
                }
            })   
            $("#Pause").bind("click", function(){                
                if(_this.playState){
                    _this.pause();
                    _this.playState = 0
                }
                
            })  
            $("#Reset").bind("click", function(){
                _this.reset();
                _this.playState = 0
            })  
        };
        /**
         * @private
         * @method _initStep
         * @description  
         */        
        this._initStep = function(){
            var countofChanges = 0;
            
            function checkLiveCells(){
                $("#Life td.live").each(function(){
                    var parent = $(this).parent(),
                        neighbors = 0,
                        position = $(this).data("position");

                    parent.prev().find("td.live").each(function(){
                        if($(this).data("position") === position || $(this).data("position") === position -1 || $(this).data("position") === position +1){
                            neighbors++;
                        }
                    })

                    parent.next().find("td.live").each(function(){
                        if($(this).data("position") === position || $(this).data("position") === position -1 || $(this).data("position") === position +1){
                            neighbors++;
                        }
                    })

                    parent.find("td.live").each(function(){
                        if($(this).data("position") === position -1 || $(this).data("position") === position +1){
                            neighbors++;
                        }
                    })

                    if(neighbors > 3 || neighbors < 2){                          
                        $(this).data("state", "ded");
                        countofChanges++;
                    }            
                })
            }
            function checkDedCells(){
                $("#Life td:not(live)").each(function(){
                    var parent = $(this).parent(),
                        neighbors = 0,
                        position = $(this).data("position");

                    parent.prev().find("td.live").each(function(){
                        if($(this).data("position") === position || $(this).data("position") === position -1 || $(this).data("position") === position +1){
                            neighbors++;
                        }
                    })
                    parent.next().find("td.live").each(function(){
                        if($(this).data("position") === position || $(this).data("position") === position -1 || $(this).data("position") === position +1){
                            neighbors++;
                        }
                    })
                    parent.find("td.live").each(function(){
                        if($(this).data("position") === position -1 || $(this).data("position") === position +1){
                            neighbors++;
                        }
                    })
                    if(neighbors  === 3){                
                        $(this).data("state", "live");
                        countofChanges++;
                    }
                })
            }            
            checkLiveCells();
            checkDedCells();
            
            $("#Life td").each(function(){         
                $(this).attr("class", $(this).data("state"))
            })  
            
            if(!countofChanges){
                this.gameOver(1);
            } 
            if(!$("#Life td.live").length){
                this.gameOver(0);
            }
        
        }
        /**
         * @private
         * @method _updateBoard
         * @description  
         */ 
        this._updateBoard = function(){
            var _this = this;
            
            function addNewCell(){
                $("#Life tr").each(function(){
                    $(this).find("td").eq(0).remove();
                    $(this).append("<td>");
                });
                $("#Life tr").each(function(){
                    $(this).find("td").each(function(index){              
                    $(this).data("position", index);
                    });
                });
            }
            
            function addNewRow(){
                $("#Life").append($("#Life tr").eq(0).remove());
                    $("#Life tr").each(function(){
                        $(this).find("td").each(function(index){              
                        $(this).data("position", index);
                    })
                })                
            }
            
             $("#Life td.live").each(function(){  
                if(!$(this).parent().next().length){
                    addNewRow();
                }
                 
                if($(this).data("position") === (_this.complication - 1)){
                     addNewCell();
                 }
            });
        }
        /**
         * @public
         * @method Init
         * @description  
         */  
        this.Init = function(){
            this._createBoard();
            this._addEvents();            
        }
        /**
         * @public
         * @method play
         * @description  
         */  
        this.play = function(){ 
            var _this = this;
            this.playState = 1;
            this.playInterval = setInterval(function(){
                _this._updateBoard();
                _this._initStep(); 
                _this._updateBoard();
            }, 1000);
        };
        this.pause = function(){     
            var _this = this;
            clearInterval(_this.playInterval)
        };
         this.reset = function(){     
            var _this = this;
            clearInterval(_this.playInterval);
            $("#Life").html("");
            this.Init();
            
        };
        this.gameOver = function(reason){ 
            var _this = this;
            if(reason){
                $("#dialog-message p").html("Ни одна из клеток не меняет своего состояния");
            } else {
                $("#dialog-message p").html("На поле не останется ни одной «живой» клетки");
            }
            clearInterval(_this.playInterval);
            $("#dialog-message").dialog({
                modal: true,
                buttons: {
                  "Новая игра": function() {
                    $(this).dialog( "close" );
                    _this.reset();
                  }
                }
            });
            $("#dialog" ).dialog();
        };
    }  
    
    // Init game
    var lifeGame = new Life();
    lifeGame.Init();
    
});


