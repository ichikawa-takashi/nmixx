jQuery(function ($) { // この中であればWordpressでも「$」が使用可能になる

    var topBtn = $('.pagetop');
    topBtn.hide();

    // ボタンの表示設定
    $(window).scroll(function () {
        if ($(this).scrollTop() > 70) {
            // 指定px以上のスクロールでボタンを表示
            topBtn.fadeIn();
        } else {
            // 画面が指定pxより上ならボタンを非表示
            topBtn.fadeOut();
        }
    });

    // ボタンをクリックしたらスクロールして上に戻る
    topBtn.click(function () {
        $('body,html').animate({
            scrollTop: 0
        }, 300, 'swing');
        return false;
    });

    //ドロワーメニュー
    $("#MenuButton").click(function () {
        // $(".l-drawer-menu").toggleClass("is-show");
        // $(".p-drawer-menu").toggleClass("is-show");
        $(".js-drawer-open").toggleClass("open");
        $(".drawer-menu").toggleClass("open");
        $("html").toggleClass("is-fixed");

    });



    // スムーススクロール (絶対パスのリンク先が現在のページであった場合でも作動)

    $(document).on('click', 'a[href*="#"]', function () {
        let time = 400;
        let header = $('header').innerHeight();
        let target = $(this.hash);
        if (!target.length) return;
        let targetY = target.offset().top - header;
        $('html,body').animate({
            scrollTop: targetY
        }, time, 'swing');
        return false;
    });

    // ハンバーガーメニュー
    // header/footerをJSで動的に読み込むため、要素が後から追加されても効くように委任(delegate)で束縛する
    $(function () {
        $(document).on("click", ".js-hamburger", function () {
            $(this).toggleClass("is-open");
            if ($(this).hasClass("is-open")) {
                openDrawer();
            } else {
                closeDrawer();
            }
        });

        // backgroundまたはページ内リンクをクリックで閉じる
        $(document).on("click", ".js-drawer a[href]", function () {
            closeDrawer();
        });

        // resizeイベント
        $(window).on('resize', function () {
            if (window.matchMedia("(min-width: 768px)").matches) {
                closeDrawer();
            }
        });
    });

    function openDrawer() {
        $(".js-drawer").addClass("is-open");
        $(".js-hamburger").addClass("is-open");
    }

    function closeDrawer() {
        $(".js-drawer").removeClass("is-open");
        $(".js-hamburger").removeClass("is-open");
    }

    // top-fv スライダー
    if ($(".top-fv__slider").length) {
        new Swiper(".top-fv__slider", {
            effect: "fade",
            fadeEffect: {
                crossFade: true
            },
            loop: true,
            speed: 800,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false
            },
            pagination: {
                el: ".top-fv__dots",
                clickable: true,
                bulletClass: "top-fv__dot",
                bulletActiveClass: "is-current"
            }
        });
    }

    // top-fv ANSWER bubbles
    $(".js-fv-bubbles-button").on("click", function () {
        var bubbles = $(this).closest(".js-fv-bubbles");
        var isOpen = bubbles.toggleClass("is-open").hasClass("is-open");

        $(this)
            .attr("aria-expanded", isOpen ? "true" : "false")
            .attr("aria-label", isOpen ? "NSWERリンクを閉じる" : "NSWERリンクを開く");
    });

    // top-fv ANSWER bubbles: フッターに重なったらフェードダウンで非表示、離れたらフェードアップで再表示
    if ($(".js-fv-bubbles").length) {
        var fvBubbles = document.querySelector(".js-fv-bubbles");

        function watchFooterForBubbles() {
            var footer = document.querySelector(".footer");
            if (!footer) return;

            var footerObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        fvBubbles.classList.add("is-hidden");
                        $(fvBubbles).removeClass("is-open");
                        $(".js-fv-bubbles-button")
                            .attr("aria-expanded", "false")
                            .attr("aria-label", "NSWERリンクを開く");
                    } else {
                        fvBubbles.classList.remove("is-hidden");
                    }
                });
            });

            footerObserver.observe(footer);
        }

        if (document.querySelector(".footer")) {
            watchFooterForBubbles();
        } else {
            document.addEventListener("parts:loaded", function (e) {
                if (e.detail && e.detail.url === "./parts/footer.html") {
                    watchFooterForBubbles();
                }
            });
        }
    }

    // top-movie スライダー(SPのみ。2枚1組でページ送り。画面幅がPC/SPの境界(768px)をまたいだ時に作り直す)
    if ($(".top-movie__list.swiper").length) {
        var movieSwiper = null;

        function createMovieSwiper() {
            return new Swiper(".top-movie__list", {
                slidesPerView: 2,
                slidesPerGroup: 2,
                spaceBetween: 20,
                navigation: {
                    prevEl: ".top-movie__sp-arrow--prev",
                    nextEl: ".top-movie__sp-arrow--next"
                },
                pagination: {
                    el: ".top-movie__sp-dots",
                    clickable: true,
                    bulletClass: "top-movie__sp-dot",
                    bulletActiveClass: "is-current"
                }
            });
        }

        // PC(768px以上)ではSwiperを破棄してSP用に追加されたインラインスタイルを除去し、
        // SPに戻ったら作り直す
        var moviePcQuery = window.matchMedia("(min-width: 768px)");
        function syncMovieSwiper(query) {
            if (query.matches) {
                if (movieSwiper) {
                    movieSwiper.destroy(true, true);
                    movieSwiper = null;
                }
            } else if (!movieSwiper) {
                movieSwiper = createMovieSwiper();
            }
        }
        syncMovieSwiper(moviePcQuery);
        moviePcQuery.addEventListener("change", syncMovieSwiper);
    }

    // top-movie YouTube modal
    if ($(".js-youtube-modal-open").length) {
        $(".js-youtube-modal-open").each(function () {
            var youtubeId = $(this).data("youtube-id");
            var thumb = $(this).find(".js-youtube-thumb");

            if (youtubeId && thumb.length) {
                thumb.attr("src", "https://img.youtube.com/vi/" + youtubeId + "/maxresdefault.jpg");
                thumb.on("error", function () {
                    $(this).off("error").attr("src", "https://img.youtube.com/vi/" + youtubeId + "/hqdefault.jpg");
                });
            }
        });

        $(".js-youtube-modal-open").on("click", function (e) {
            e.preventDefault();
            var youtubeId = $(this).data("youtube-id");

            if (!youtubeId) {
                return;
            }

            $(".js-youtube-iframe").attr("src", "https://www.youtube.com/embed/" + youtubeId + "?autoplay=1&rel=0");
            $(".js-youtube-modal").addClass("is-open").attr("aria-hidden", "false");
            $("html,body").css("overflow", "hidden");
        });
    }

    $(".js-youtube-modal-close").on("click", function () {
        closeYoutubeModal();
    });

    $(document).on("keydown", function (e) {
        if (e.key === "Escape" && $(".js-youtube-modal").hasClass("is-open")) {
            closeYoutubeModal();
        }
    });

    function closeYoutubeModal() {
        $(".js-youtube-modal").removeClass("is-open").attr("aria-hidden", "true");
        $(".js-youtube-iframe").attr("src", "");
        $("html,body").css("overflow", "initial");
    }

    // modal
    $(".js-modal-open").each(function () {
        $(this).on("click", function (e) {
            e.preventDefault();
            var target = $(this).data("target");
            var modal = document.getElementById(target);
            $(modal).fadeIn();
            $("html,body").css("overflow", "hidden");
        });
    });
    $(".js-modal-close").on("click", function () {
        $(".js-modal").fadeOut();
        $("html,body").css("overflow", "initial");
    });
});
