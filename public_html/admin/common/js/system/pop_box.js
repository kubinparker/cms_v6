/**
 * PopBox
 */

function PopBox() {
    this.colorbox_elm = '.pop_box';
    this.image_elm = ".pop_image_single";
}
PopBox.prototype = {
    /**
     * ポップアップ 閉じる
     * @param  {[type]} elm [description]
     * @return {[type]}     [description]
     */
    close: function() {
        jQuery(this.colorbox_elm).colorbox.close();
    },
    remove: function() {
        jQuery(this.colorbox_elm).colorbox.remove();
    },
    open: function(options) {
        var elm = this.colorbox_elm;

        if (typeof options !== 'undefined') {
            if (typeof options.element !== 'undefined') {
                elm = options.element;
                this.colorbox_elm = elm;
            }
        }
        jQuery(elm).colorbox(options);
    },
    select: function(options) {
    },
    image_single: function(opt) {
        var elm = this.image_elm;
        var that = this;
        var options = {
            maxWidth: "90%",
            maxHeight: "90%",
            opacith: 0.7,
            open: true,
            onClosed: function() {
                that.image_single_remove();
            }
        };
        if (typeof opt !== 'undefined') {
            options = opt;
        }

        jQuery(elm).colorbox(options);
    },
    image_single_remove: function(){
        jQuery(this.image_elm).colorbox.remove();
    }
}