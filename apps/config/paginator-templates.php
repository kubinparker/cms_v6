<?php

/**
 * ページネーションのレイアウトを変更したい場合はここを編集
 */
return [
    'nextActive' => '<a style="text-decoration: none" class="news-pagination__item link__alpha arr next" rel="next" href="{{url}}">{{text}}</a>',

    'prevActive' => '<a <a class="news-pagination__item link__alpha arr prev" rel="prev" href="{{url}}">{{text}}</a>',
    'prevDisabled' => '<a class="pager__page omit"  href="" onclick="return false;">{{text}}</a>',
    'number' => '<a style="text-decoration: none" class="news-pagination__item link__alpha" href="{{url}}">{{text}}</a>',
    'current' => '<a style="text-decoration: none" class="news-pagination__item link__alpha current" href="{{url}}">{{text}}</a>',
];

