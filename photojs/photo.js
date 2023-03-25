let config = {
    width: 160,
    height: 330,
    //宿主id
    owner:'photos',
    diff_angle: 7,
    R: 500,
    scale:0.95,
    wait_frame: 150,
};

class Photos {
    constructor(images) {
        if (typeof images != "object") {
            console.log(`You should pass array,not ${typeof images}`);
        }
        this.leftStack = new Array();
        this.rightStack = new Array();
        this.container = document.createElement("div");
        this.container.setAttribute("style", this.containerStyle());
        let middleIndex = Math.floor(images.length / 2);
        this.images = images;
        this.render(middleIndex);
        this.currentFrame = 0;
        if (this.images.length >= 2) {
            this.requestRender();
            this.frontFlag = true;
        }
    }
    requestRender() {
        if (this.currentFrame + 1 >= config.wait_frame) {
            this.currentFrame = 0;
            this.remove();
            let index;
            if (this.frontFlag) {
                if (this.currentIndex + 1 > this.images.length - 1) {
                    index = this.images.length - 2;
                    this.frontFlag = false;
                } else {
                    index = this.currentIndex + 1;
                }
            } else {
                if (this.currentIndex - 1 < 0) {
                    index = 1;
                    this.frontFlag = true;
                } else {
                    index = this.currentIndex - 1;
                }
            }
            this.render(index);
        } else {
            this.currentFrame += 1;
        }
        let that = this;
        window.requestAnimationFrame(function() {
            that.requestRender();
        });
    }
    remove() {
        while(this.container.hasChildNodes()) {
            this.container.removeChild(this.container.firstChild);
        }
    }
    render(middleIndex) {
        let that = this;
        this.images.forEach(function (value, index, arr) {
            let diffIndex = Math.abs(middleIndex - index);
            let wrap = document.createElement("div");
            let scale = ` scale(${Math.pow(config.scale, diffIndex)})`;
            //左边
            if (index < middleIndex) {
                let img = document.createElement("img");
                img.src = value;
                let trans = "transform: translate(-50%, -50%)";
                let deg = config.diff_angle * diffIndex;
                trans = trans + ` rotateY(${-deg}deg)`;
                let rad = deg * Math.PI / 180;
                let x = -Math.sin(rad) * config.R;
                let y = 0;
                let z = Math.cos(rad) * config.R;
                trans = trans + scale;
                trans = trans + ` translate3d(${x}px, ${y}px, ${z}px)`;
                img.setAttribute("style", that.imgFixedStyle());
                let style = that.imgWarpStyle() + trans;
                wrap.setAttribute("style", style);
                wrap.appendChild(img);
                that.leftStack.push(wrap);
            } else if (index > middleIndex) {
                let img = document.createElement("img");
                img.src = value;
                let trans = "transform: translate(-50%, -50%)";
                let deg = config.diff_angle * diffIndex;
                trans = trans + ` rotateY(${deg}deg)`;
                trans = trans + scale;
                let rad = deg * Math.PI / 180;
                let x = Math.sin(rad) * config.R;
                let y = 0;
                let z = Math.cos(rad) * config.R;
                trans = trans + ` translate3d(${x}px, ${y}px, ${z}px)`;
                img.setAttribute("style", that.imgFixedStyle());
                wrap.appendChild(img);
                let style = that.imgWarpStyle() + trans;
                wrap.setAttribute("style", style);
                that.rightStack.push(wrap);
            } else {
                let img = document.createElement("img");
                img.src = value;
                let trans = "transform: translate(-50%, -50%)";
                let deg = config.diff_angle * diffIndex;
                trans = trans + ` rotateY(${deg}deg)`;
                trans = trans + scale;
                let rad = deg * Math.PI / 180;
                let x = Math.sin(rad) * config.R;
                let y = 0;
                let z = Math.cos(rad) * config.R;
                trans = trans + ` translate3d(${x}px, ${y}px, ${z}px)`;
                img.setAttribute("style", that.imgFixedStyle());
                let style = that.imgWarpStyle() + trans;
                wrap.setAttribute("style", style);
                wrap.appendChild(img);
                that.currentElement = wrap;
            }
            that.container.appendChild(wrap);
            wrap.onclick = function() {
                if (index == that.currentIndex) {
                    return;
                }
                //keep wait
                that.currentFrame = 0;
                that.currentIndex = index;
                that.remove();
                that.render(index);
            };
        });
        that.currentIndex = middleIndex;
    }
    imgWarpStyle() {
        return `
            position: absolute;
            width:${config.width}px;
            height:${config.height}px;
            top: 50%;
            left: 50%;
            box-shadow: 3px 2px 4px #888888;
        `;
    }
    imgFixedStyle() {
        return `
            width: 100%;
            height: 100%;
            display: block;
        `
    }
    containerStyle() {
        return `
            margin:0;
            height:100%;
            transform-style: preserve-3d;
            perspective: 1200px;
            position: relative;
        `;
    }
}
class App {
    constructor(list) {
        let that = this;
        console.log(list.length);
        let init = function() {
            let body = document.getElementsByTagName("body")[0];
            //document.getElementsByTagName("body")[0].style.height = window.innerHeight;
            let photoList = document.createElement("div");
            photoList.setAttribute("id", config.owner);
            photoList.setAttribute("style", that.photoListStyle(window.innerHeight));
            list.forEach(function(value, index, arr) {
                let cell = document.createElement("div");
                cell.setAttribute("style", that.photoCellStyle());
                let caption = document.createElement("h2");
                caption.innerText = value.title;
                caption.setAttribute("style", that.titleStyle());
                cell.appendChild(caption);
                let photo = new Photos(value.images);
                cell.appendChild(photo.container);
                photoList.appendChild(cell);
            });
            body.appendChild(photoList);
        };
        window.onload = init;
    }
    photoCellStyle() {
        return `
            width: 100%;
            height: 600px;
            margin-left: 10px;
            margin-right: 10px;
            margin-top: 50px;
            margin-bottom: 130px;
        `;
        
    }
    photoListStyle(height) {
        return `
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
        `;
    }
    titleStyle() {
        return `
            color: #00A3B2;
        `;
    }
}

let app = new App([
    {
        title:"我喜欢",
        images:[
            '/photoimgs/favorite/f001.jpg',
            '/photoimgs/favorite/f002.jpg',
            '/photoimgs/favorite/f003.jpg',
            '/photoimgs/favorite/f004.jpg',
            '/photoimgs/favorite/f005.jpg',
            '/photoimgs/favorite/f006.jpg',
            '/photoimgs/favorite/f007.jpg',
            '/photoimgs/favorite/f008.jpg',
        ],
    },
    {
        title:"还是我喜欢",
        images:[
            '/photoimgs/again/a001.jpg',
            '/photoimgs/again/a002.jpg',
            '/photoimgs/again/a003.jpg',
            '/photoimgs/again/a004.jpg',
            '/photoimgs/again/a005.jpg',
            '/photoimgs/again/a006.jpg',
            '/photoimgs/again/a007.jpg',
            '/photoimgs/again/a008.jpg',
        ],
    },
    {
        title:"青春猪头少年不会梦到兔女郎学姐",
        images: [
            '/photoimgs/yd/my0001.jpg',
            '/photoimgs/yd/my0002.jpg',
            '/photoimgs/yd/my0003.jpg',
            '/photoimgs/yd/my0004.jpg',
            '/photoimgs/yd/my0005.jpg',
            '/photoimgs/yd/my0006.jpg',
            '/photoimgs/yd/my0007.jpg',
            '/photoimgs/yd/my0008.jpg',
            '/photoimgs/yd/my0009.jpg',
            '/photoimgs/yd/my0010.jpg',
            '/photoimgs/yd/my0011.jpg',
            '/photoimgs/yd/my0012.jpg',
        ],
    },
    {
        title:"我的青春恋爱物语果然有问题",
        images: [
            '/photoimgs/qw/qw0001.jpg',
            '/photoimgs/qw/qw0002.jpg',
            '/photoimgs/qw/qw0003.jpg',
            '/photoimgs/qw/qw0004.jpg',
            '/photoimgs/qw/qw0005.jpg',
            '/photoimgs/qw/qw0006.jpg',
            '/photoimgs/qw/qw0007.jpg',
            '/photoimgs/qw/qw0008.jpg',
            '/photoimgs/qw/qw0009.jpg',
        ]
    }
]);