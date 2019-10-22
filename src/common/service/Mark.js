export default class Mark {
    constructor(dom, vm) {
        var _this = this;
        _this.dom = dom;
        _this.historyMarks = [];
        _this.vm = vm;

        // 监听dom的鼠标松开事件，获取选中文本结点
        _this.dom.addEventListener('mouseup', function (e) {
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            _this.start = {
                node: range.startContainer,
                offset: range.startOffset
            };
            _this.end = {
                node: range.endContainer,
                offset: range.endOffset
            };
        });
    }

    // 标注
    mark(tag, cb) {
        var _this = this;
        if (_this.start && _this.end) {
            var startElement = _this.start.node.parentElement;
            var endElement = _this.end.node.parentElement;
            var startNode = {
                el: startElement,
                id: startElement.id,
                offset: startElement.id.split('_')[1] * 1
            };
            var endNode = {
                el: endElement,
                id: endElement.id,
                offset: endElement.id.split('_')[1] * 1
            };

            // 检查中间是否有已经被标注的
            var isPass = true;
            for(let i=startNode.offset;i<=endNode.offset;i++){
                var curDom = document.getElementById(`offset_${i}`);
                if(curDom.parentElement.className.indexOf('marked-text')>=0){
                    isPass = false;
                    break;
                }
            }
            if(!isPass){
                _this.vm.$message.error("已被标注的内容,不能重复标注");
                return;
            }
            // 创建标注后的元素
            var wrap = _this._createWrap(startNode, endNode, tag);
            if (startNode.offset > 0) {
                var preElement = document.getElementById(`offset_${startNode.offset - 1}`);
                // 如果前面一个元素已经被标注，则在前面一个元素的父元素后面插入
                if(preElement.parentElement.className.indexOf('marked-text')>=0){
                    preElement.parentElement.insertAdjacentElement('afterend', wrap);
                }else{
                    preElement.insertAdjacentElement('afterend', wrap);
                }
            } else {
                // 如果是从第一个字开始的
                var nextElement = document.getElementById(`offset_${endNode.offset + 1}`);

                // 如果前面一个元素已经被标注，则在前面一个元素的父元素后面插入
                if(nextElement.parentElement.className.indexOf('marked-text')>=0){
                    nextElement.parentElement.insertAdjacentElement('beforebegin', wrap);
                }else{
                    nextElement.insertAdjacentElement('beforebegin', wrap);
                }
            }
            cb && cb({
                offset: startNode.offset,
                length: endNode.offset - startNode.offset + 1,
                name: tag.name,
                linkDomId: wrap.id,
                score: 0
            });
            _this.start = null;
            _this.end = null;
        }
    }

    delete(curMark) {
        var wrapId = curMark.linkDomId;
        var _this = this;
        deleteWrap();

        function deleteWrap() {
            var wrap = document.getElementById(wrapId);
            var preDom = wrap.previousElementSibling;
            var children = wrap.children;
            if (children.length > 1) {
                preDom.insertAdjacentElement('afterend', children[0]);
                deleteWrap();
            } else {
                _this.dom.children[0].removeChild(wrap);

            }
        }
    }

    // 标注，创建包裹元素
    _createWrap(startNode, endNode, tag,score) {
        var _this = this;
        var wrap = document.createElement('span');
        if (_this.historyMarks.length > 0) {
            var maxId = _this.historyMarks[_this.historyMarks.length - 1].split('_')[1] * 1;
            wrap.id = `mark_${maxId + 1}`;
        } else {
            wrap.id = `mark_0`;
        }
        _this.historyMarks.push(wrap.id);
        wrap.className = 'marked-text';
        wrap.style.color = '#fff';
        wrap.style.background = tag.color;
        for (let i = startNode.offset; i <= endNode.offset; i++) {
            let dom = document.getElementById(`offset_${i}`);
            wrap.appendChild(dom);
        }
        var scoreHtml = `<span class="mark-score">${score || ''}</span>`;
        endNode.el.insertAdjacentHTML('afterend', scoreHtml);

        wrap.onclick = function (e) {
            var markScoreModal = document.getElementById('markScoreModal');
            if(!markScoreModal){
                return;
            }
            _this.vm.curMark = _.findWhere(_this.vm.marks, {linkDomId: wrap.id});
            _this.vm.curTag = _.findWhere(_this.vm.srcTags,{name:_this.vm.curMark.name});
            markScoreModal.style.left = e.pageX;
            markScoreModal.style.top = e.pageY + 15;
            _this.vm.isScore = true;
            var elInput = document.getElementById('markScoreInput');
            setTimeout(function () {
                elInput && elInput.focus();
            })
        };
        wrap.title = tag.name;
        return wrap;
    }

    score(curMark) {
        var dom = document.getElementById(`${curMark.linkDomId}`);
        var scoreDom = dom.lastElementChild;
        scoreDom.innerHTML = curMark.score;
    }

    run(marks) {
        var _this = this;
        _.each(marks, function (v, k) {
            var startElement = document.getElementById(`offset_${v.offset}`);
            var endElement = document.getElementById(`offset_${v.offset + v.length - 1}`);
            var tag = _.findWhere(_this.vm.srcTags, {name: v.name});
            // 如果该标记的
            if (!tag) {
                v.isDelete = true;
                return;
            }
            var startNode = {
                el: startElement,
                id: startElement.id,
                offset: v.offset
            };
            var endNode = {
                el: endElement,
                id: endElement.id,
                offset: v.offset + v.length - 1
            };
            // 创建标注后的元素
            var wrap = _this._createWrap(startNode, endNode, tag,v.score);

            if (startNode.offset > 0) {
                var preElement = document.getElementById(`offset_${startNode.offset - 1}`);
                // 如果前面一个元素已经被标注，则在前面一个元素的父元素后面插入
                if(preElement.parentElement.className.indexOf('marked-text')>=0){
                    preElement.parentElement.insertAdjacentElement('afterend', wrap);
                }else{
                    preElement.insertAdjacentElement('afterend', wrap);
                }
            } else {
                // 如果是从第一个字开始的
                var nextElement = document.getElementById(`offset_${endNode.offset + 1}`);

                // 如果前面一个元素已经被标注，则在前面一个元素的父元素后面插入
                if(nextElement.parentElement.className.indexOf('marked-text')>=0){
                    nextElement.parentElement.insertAdjacentElement('beforebegin', wrap);
                }else{
                    nextElement.insertAdjacentElement('beforebegin', wrap);
                }
            }

            v.linkDomId = wrap.id;
        });
    }
}

