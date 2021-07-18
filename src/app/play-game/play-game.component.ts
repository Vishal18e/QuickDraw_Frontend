///////////////////////////////////////////// Typescript code//////////////////////////////////////////////////
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef,Input, OnInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-play-game',
  templateUrl: './play-game.component.html',
  styleUrls: ['./play-game.component.css']
})
export class PlayGameComponent implements OnInit {
  
    ngOnInit(): void {
  }
  
  constructor(private http:HttpClient){}
 
  @ViewChild('Mycanvas') public canvas: ElementRef;
  private encl_canv;

  private canvas_width;
  private canvas_height;

  private cx: CanvasRenderingContext2D;  

  
  public ngAfterViewInit() {

    const MyCanvas: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = MyCanvas.getContext('2d');

    const rect = MyCanvas.getBoundingClientRect();
    MyCanvas.width = rect.right-rect.left;
    MyCanvas.height = rect.bottom-rect.top;

    this.canvas_width=rect.right-rect.left;
    this.canvas_height =  rect.bottom-rect.top;


    this.cx.lineWidth = 2;
    this.cx.strokeStyle = '#000';
    
    this.captureEvents(MyCanvas);// catures mouse event


    ////////////////////optional/////////////////
    //////Mobile sensitive/////////////////////////////////
    MyCanvas.addEventListener("touchmove", function (e) {
      var touch = e.touches[0];
      e.preventDefault();
      e.stopPropagation();
      var mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      MyCanvas.dispatchEvent(mouseEvent);
    }, false);
    MyCanvas.addEventListener("touchstart", function (e) {
      var touch = e.touches[0];
      e.preventDefault();
      e.stopPropagation();
      var mouseEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      MyCanvas.dispatchEvent(mouseEvent);
    }, false)

  }



  public clear_board_subs(){
      this.cx.clearRect(0, 0, this.canvas_width, this.canvas_height);
  };


  //////////////////// Capturing the Events  ////////////////////////////

  private captureEvents(MyCanvas: HTMLCanvasElement) {
    fromEvent(MyCanvas, 'mousedown')
      .pipe(
        switchMap((e) => {
          return fromEvent(MyCanvas, 'mousemove')
            .pipe(
              takeUntil(fromEvent(MyCanvas, 'mouseup')),
              takeUntil(fromEvent(MyCanvas, 'mouseleave')),  
              pairwise()
            )
        })
      )
      .subscribe((res: [MouseEvent, MouseEvent]) => {
        const rect = MyCanvas.getBoundingClientRect();
        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top
        };
  
        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top
        };
  
        this.drawOnCanvas(prevPos, currentPos);
      });
  }




  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////


  private drawOnCanvas(

    prevPos: { x: number, y: number }, 
    currentPos: { x: number, y: number }
  ) {
    if (!this.cx) { return; }
    console.log(prevPos,currentPos);
    this.cx.beginPath();

    if (prevPos) {

      this.cx.moveTo(prevPos.x, prevPos.y); 
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.stroke();
    }
  }

  CommandFunc(results:any){
      this.final_class_name = results;
      this.comment = "You have drawn : "
      this.clear_board_subs();
  }

  comment:string=" ";
  className:string="new_img";
  final_class_name=" ";

  public clear_board(){
    this.cx.clearRect(0, 0, this.canvas_width, this.canvas_height);
    this.comment=" ";
    this.final_class_name =" ";
  };

  detectImage(){
    const MyCanvas: HTMLCanvasElement = this.canvas.nativeElement;
    if(MyCanvas==null){
      alert("PLease draw on the Canvas.")
      return;
    }
    
    var date =Date.now();

    var filename = this.className +'_'+ date+'.png';
    var image = MyCanvas.toDataURL("image/png");
    this.http.post(
       environment.SERVER_URL + '/play',
      {filename,image,className:this.className},
      {responseType:'text'}
    ).subscribe((res:any)=>{
      console.log(res,this.className);
      this.CommandFunc(res);
    })

  }



}

