import { AfterContentInit, AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from "@angular/core";

@Directive({
    selector: "[yiAutoScroll]",
})

export class YiAutoScrollDirective implements  OnDestroy, AfterViewInit {

    @Input("lock-y-offset") public lockYOffset!: string;
    @Input("observe-attributes") public observeAttributes: string = "false";
    @Input("is-lock") public isLock: any = false;
    @Input("scroll-end") public scrollEnd: any;

    @Output("on-change-bottom")
    public onchangeBottom: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    public onScrollToBottom: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    public onScrollToTop: EventEmitter<any> = new EventEmitter<any>();

    private nativeElement: HTMLElement;
    private _isLocked: boolean = false;
    private mutationObserver!: MutationObserver;

    constructor(element: ElementRef) {
        this.nativeElement = element.nativeElement;
    }

    public getObserveAttributes(): boolean {
      return this.observeAttributes !== "" && this.observeAttributes.toLowerCase() !== "false";
    }

    ngAfterViewInit() {
      this._isLocked = this.isLock;

      if(!this._isLocked) {
        this.mutationObserver = new MutationObserver(() => {
          if (!this._isLocked) {
            this.forceScrollDown(500);
          }
        });

        this.mutationObserver.observe(this.nativeElement, {
          childList: true,
          subtree: true,
          attributes: this.getObserveAttributes(),
        });
      }
    }

    public ngOnDestroy(): void {
        this.mutationObserver && this.mutationObserver.disconnect();
    }

    public forceScrollDown(ms: number = 1000): any {
        this.scrollDown(ms);
    }

    public isLocked(): boolean {
        return this._isLocked;
    }

    public scrollDown(ms: number = 1000): any {
      let scroll = () => {
        this.scrollTo(this.nativeElement, this.nativeElement.scrollHeight, ms, true);
      };

      setTimeout(() => scroll(), 500);
    }

    /**
     * @desc scrollToItem Fn scrolls to an items by utilising the animated scroll fn (scrollTo)
     *       and calculating the height of the header to accurately find the item's position.
     * @param elementID: element's ID that will be scrolled to.
     * @param duration: duration in milliseconds, default is 750.
     * @param container the container html native element (or its id), window will be used if not set
     */
    scrollToElement(elementID: string, duration: number = 750, container: any): void {

        const item = document.getElementById(elementID); // the element
        if (item) {
            const itemPos = item.offsetTop;
            if (container) {
                if (typeof container === 'string') {
                    container = document.getElementById(container);
                }
                this.scrollTo(container, itemPos, duration, true);
            } else {
                this.scrollTo(window.document, itemPos, duration);
            }
        } else {
            console.error(
                `Could not find element with the following ID: ${elementID}`
            );
        }
    }

    /**
     * @desc scrollTo Fn allows scrolling with animation.
     * @param element the 'element' that the scroll will happen on.
     * @param to is the location to scroll to.
     * @param duration is the length of the animation.
     */
    private scrollTo(element: any, to: number, duration :any, isContainer: boolean = false) {
        const increment = 20,
            that = this;
            let start: number,
            remaining: number,
            currentTime = 0,
            animateScroll: (...args: any[]) => void;

        if (isContainer) {
            // for custom container element
            start = element.scrollTop;
        } else if (element.body.scrollTop > 0) {
            // for chrome
            start = element.body.scrollTop;
        } else if (element.documentElement.scrollTop > 0) {
            // for firefox
            start = element.documentElement.scrollTop;
        } else {
            start = 0;
        }

        remaining = to - start;
        animateScroll = () => {
            currentTime += increment;
            const val = that.easeInOut(currentTime, start, remaining, duration);

            if (isContainer) {
                element.scroll(0, val);
            } else {
                // to allow scroll function on different browsers both chrome and firefox
                top?.window.scroll(0, val);
            }

            if (currentTime < duration) {
                setTimeout(animateScroll, increment);
            }
        };
        animateScroll();
    }

    /**
     * @desc easeInOut Fn creates the values necessary to create easeInOut animation.
     * @param currentTime is current time.
     * @param startTime is the starting time.
     * @param remainingTime is the time period in the value.
     * @param duration is the duration of the animation
     * @returns a number value to scroll to.
     */
    private easeInOut(
        currentTime: number,
        startTime: number,
        remainingTime: number,
        duration: number) {

        currentTime /= duration / 2;

        if (currentTime < 1) {
            return (remainingTime / 2) * currentTime * currentTime + startTime;
        }

        currentTime--;
        return (
            (-remainingTime / 2) * (currentTime * (currentTime - 2) - 1) + startTime
        );
    }

    @HostListener("scroll", ['$event'])
    public scrollHandler(event: any): void {
      const yBottom = this.nativeElement.scrollHeight - this.nativeElement.scrollTop - this.nativeElement.clientHeight;
      this._isLocked = yBottom > Number(this.lockYOffset);

      if (this.nativeElement.scrollTop == 0) {
          this.onScrollToTop.emit();
      }

      if (this.nativeElement.scrollTop == this.nativeElement.scrollHeight) {
          this.onScrollToBottom.emit();
      }

      if (yBottom <= Number(this.lockYOffset) && this.scrollEnd) {
          this.onchangeBottom.emit(yBottom);
          this._isLocked = true;
      }

      event.preventDefault();
      event.stopImmediatePropagation();
    }

}
