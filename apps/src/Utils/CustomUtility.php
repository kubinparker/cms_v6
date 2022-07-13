<?php

namespace App\Utils;

use Cake\I18n\Date;
use Cake\Utility\Hash;
use Cake\Mailer\Email;
use Cake\Core\Configure;

class CustomUtility
{
    // Limitリスト
    public static $page_limit_list = [
        //'1' => '1件',
        '10' => '10件',
        //'50' => '50件',
        '100' => '100件',
        '200' => '200件',
        // "all" => '全て'
    ];

    //連想配列を必要なキーのみで再構成する。
    public static function reduceDir($dir = [], $keys = [])
    {
        // $dir = [
        //     'aomori' => '青森県',
        //     'iwate' => '岩手県',
        //     'akita' => '秋田県',
        //     'miyagi' => '宮城県',
        //     'yamagata' => '山形県',
        //     'fukushima' => '福島県',
        // ];
        // $keys = [
        //     'aomori',
        //     'fukushima'
        // ];
        // return [
        //     'aomori' => '青森県',
        //     'fukushima' => '福島県',
        // ];
        return array_flip(array_filter(array_flip($dir), function ($pref) use ($keys) {
            return in_array($pref, $keys);
        }));
    }

    //250文字ごとに改行する。　必ず最後に改行が付与される。
    public static function _preventGarbledCharacters($bigText, $width = 249)
    {
        $pattern = "/(.{1,{$width}})(?:\\s|$)|(.{{$width}})/uS";
        $replace = '$1$2' . "\n";
        $wrappedText = preg_replace($pattern, $replace, $bigText);
        return $wrappedText;
    }

    //連想配列の全ての鍵を値にする。
    public static function val2key($value)
    {
        return array_combine($value, $value);
    }

    public static function array_value_recursive($key, array $arr)
    {
        $val = [];
        array_walk_recursive($arr, function ($v, $k) use ($key, &$val) {
            if ($k == $key) array_push($val, $v);
        });
        return count($val) > 1 ? $val : array_pop($val);
    }

    //大文字小文字数字を含めたトークン
    public static function getRandomStr($length = 20)
    {
        $result = '';
        $str = array_merge(range('a', 'z'), range('A', 'Z"'), range('0', '9'));
        for ($i = 0; $i < $length; $i++) {
            $result .= $str[rand(0, count($str) - 1)];
        }
        return $result;
    }

    //ひらがなから、あかさたなを算出する
    public static function getHiraganaAKSTN($hira)
    {
        $kana = array(
            'あ' => '[あ-お]',
            'か' => '[か-こが-ご]',
            'さ' => '[さ-そざ-ぞ]',
            'た' => '[た-とだ-ど]',
            'な' => '[な-の]',
            'は' => '[は-ほば-ぼぱ-ぽ]',
            'ま' => '[ま-も]',
            'や' => '[や-よ]',
            'ら' => '[ら-ろ]',
            'わ' => '[わ-ん]',
            '他' => '.*'
        );
        foreach ($kana as $initial => $pattern) {
            if (preg_match('/^' . $pattern . '/u', $hira)) {
                return $initial;
            }
        }
        return '';
    }

    //セッションデータの取得
    public static function getSessionData($key = '', $dir = '')
    {
        $data = $_SESSION ?? [];
        if ($dir) {
            $data = $data[$dir] ?? [];
        }

        if ($key) {
            if ($key == 'id') {
                return $data[$key] ?? 0;
            } else {
                return $data[$key] ?? '';
            }
        }

        return $data;
    }

    /**
     *
     * URLまわり
     *
     */
    public static function nowUrl()
    {
        return ManageUrl::nowUrl();
    }

    public static function getUrlData($url = '')
    {
        return ManageUrl::getUrlData($url);
    }

    public static function deleteUrlQuery($url = '', $deleteQueryKey = [])
    {
        return ManageUrl::deleteUrlQuery($url, $deleteQueryKey);
    }

    public static function addUrlQuery($url = '', $addQueryData = [])
    {
        return ManageUrl::addUrlQuery($url, $addQueryData);
    }

    /**
     *
     * ログイン情報まわり
     *
     */
    //ユーザー情報の取得
    public static function getSessionUser($key = '')
    {
        return self::getSessionData($key, 'users');
    }

    //ユーザーIDの取得
    public static function getSessionUserID()
    {
        return self::getSessionData('id', 'users');
    }

    //ユーザーログイン状態の確認
    public static function isLogin()
    {
        return (bool) self::getSessionUserID();
    }

    //管理者情報の取得
    public static function getSessionAdmin($key = '')
    {
        return self::getSessionData($key, 'admin');
    }

    //管理者IDの取得
    public static function getSessionAdminID()
    {
        return self::getSessionData('id', 'admin');
    }

    //管理者のログイン状態の確認
    public static function isAdmin()
    {
        return (bool) self::getSessionAdminID();
    }

    /**
     *
     * メールまわり
     *
     */
    public static function _sendmail($post_data, $settings)
    {
        // const settings = [
        //     'test' => [//テスト用
        //         'sendmail' => true, //falseなら送らない
        //         'from' => 'test+from@caters.co.jp', //送信元
        //         'to_admin' => 'test+to@caters.co.jp', //送信先(管理者のメールアドレス
        //         'name' => 'カテル', //送信者
        //         'subject_admin' => '【テスト】お問い合わせがありました', //管理者へのメールタイトル
        //         'subject_user' => '【テスト】お問い合わせを受け付けました', //ユーザーへのメールタイトル
        //         'template_admin' => 'default_admin', //管理者へのメールテンプレ
        //         'template_user' => 'default_user'//ユーザーへのメールテンプレ
        //     ],
        //     'honban' => [//本番用
        //         'sendmail' => true,
        //         'from' => 'test+from@caters.co.jp',
        //         'to_admin' => 'test+to@caters.co.jp',
        //         'name' => 'カテル',
        //         'subject_admin' => '【本番】お問い合わせがありました',
        //         'subject_user' => '【本番】お問い合わせを受け付けました',
        //         'template_admin' => 'default_admin',
        //         'template_user' => 'default_user'
        //     ]
        // ];
        return ManageEmail::_sendmail($post_data, $settings);
    }

    /**
     *
     * 日付まわり
     *
     */
    //様々な形式の日付をdate型にして返す。
    public static function getDate($date = '', $format = '')
    {
        return ManageDate::getDate($date, $format);
    }

    //その月の初日
    public static function getMonthFirstDay($date, $format = 'Y-m-d')
    {
        return ManageDate::getMonthFirstDay($date, $format);
    }

    //その月の末日
    public static function getMonthLastDay($date, $format = 'Y-m-d')
    {
        return ManageDate::getMonthLastDay($date, $format);
    }

    public static function getNow($format = 'Y-m-d H:i')
    {
        return ManageDate::getDate('', $format);
    }

    public static function getDateJP($date = '')
    {
        return ManageDate::getDate($date, 'jp');
    }

    public static function nextDay($date)
    {
        return ManageDate::nextDay($date);
    }

    /**
     *
     * IP、サーバー情報まわり
     *
     */
    //サブネットマスク後のIPを確認
    public static function isExternalIP()
    {
        return ManageServerIp::isExternalIP();
    }

    //IPアドレスの取得
    public static function getIp()
    {
        return ManageServerIp::getIp();
    }

    //リファラーの取得
    public static function getReferrer()
    {
        return ManageServerIp::getReferrer();
    }

    /**
     *
     * 都道府県関数
     *
     */
    public static function getPrefList($needle = null)
    {
        return ManagePrefectures::getPrefList($needle);
    }

    public static function getPrefData($needs = null)
    {
        return ManagePrefectures::getPrefData($needs);
    }

    public static function getAreaName($pref_slug)
    {
        return ManagePrefectures::getAreaName($pref_slug);
    }

    public static function isPrefSlug($pref_slug)
    {
        return (bool) ManagePrefectures::getAreaName($pref_slug);
    }

    public static function getJpAreaList($need_pref_slug = null)
    {
        return ManagePrefectures::getJpAreaList($need_pref_slug);
    }

    public static function getAreaPrefOptgroupList($needs = null)
    {
        return ManagePrefectures::getAreaPrefOptgroupList($needs);
    }

    /**
     *
     * その他
     *
     */

    //SomeImageTable と BinaryFileAttacheBehaviorで使う
    public static function convertPath()
    {
        $is_local = (strpos(env('HTTP_HOST'), 'localhost') !== false || self::is_included_host(['local', 'loca']));
        if ($is_local) {
            return '/usr/local/bin/convert';
        } else {
            return '/usr/bin/convert';
        }
    }

    function is_included_host($targets = array())
    {
        foreach ($targets as $target) {
            if (strpos(env('HTTP_HOST'), $target) !== false) {
                return true;
            }
        }
        return false;
    }
}

/**
 *
 * サーバー情報まわり
 *
 */
class ManageServerIp
{
    //サブネットマスク後のIPを確認
    public static function isExternalIP()
    {
        $remote_ip = self::getIp();
        $dokkyo_accepts = [
            // '202.250.238.0/23',
            // '202.209.203.88/29',
            // '114.160.88.0/27',

            //カテル用
            //ルート　192.168.1.1
            '121.2.64.195',
            //ルート　192.168.1.2
            '39.110.198.114',
            //ルート192.168.1.3
            //"121.101.85.59"
        ];
        foreach ($dokkyo_accepts as $accept) {
            $address = explode('/', $accept);
            if (isset($address[1])) {
                list($accept_ip, $mask) = $address;
                $accept_long = ip2long($accept_ip) >> (32 - $mask);
                $remote_long = ip2long($remote_ip) >> (32 - $mask);
                if ($accept_long == $remote_long) {
                    return false;
                }
            } else {
                $address = $address[0];
                if ($address == $remote_ip) {
                    return false;
                }
            }
        }
        return true;
    }

    //IPアドレスの取得
    public static function getIp()
    {
        $ip = '';
        if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ipArray = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
            $ip = $ipArray[0];
        }
        if (!empty($_SERVER['REMOTE_ADDR'])) {
            $ip = $_SERVER['REMOTE_ADDR'];
        }
        return $ip;
    }

    //リファラーの取得
    public static function getReferrer()
    {
        $referer = '';
        if (!empty($_SERVER['HTTP_REFERER'])) {
            $referer = $_SERVER['HTTP_REFERER'];
        }
        return $referer;
    }
}

/**
 *
 * メールまわり
 *
 */
class ManageEmail
{
    //Formに変数登録することで上書きできる
    const setting_default = [
        'test' => [ //テスト用
            'sendmail' => true, //falseなら送らない
            'from' => 'test+from@caters.co.jp', //送信元
            'to_admin' => 'test+to@caters.co.jp', //送信先(管理者のメールアドレス
            'name' => 'カテル', //送信者
            'subject_admin' => '【テスト】お問い合わせがありました', //管理者へのメールタイトル
            'subject_user' => '【テスト】お問い合わせを受け付けました', //ユーザーへのメールタイトル
            'template_admin' => 'default_admin', //管理者へのメールテンプレ
            'template_user' => 'default_user' //ユーザーへのメールテンプレ
        ],
        'honban' => [ //本番用
            'sendmail' => true,
            'from' => 'test+from@caters.co.jp',
            'to_admin' => 'test+to@caters.co.jp',
            'name' => 'カテル',
            'subject_admin' => '【本番】お問い合わせがありました',
            'subject_user' => '【本番】お問い合わせを受け付けました',
            'template_admin' => 'default_admin',
            'template_user' => 'default_user'
        ]
    ];

    /**
     * メール送信
     */
    public static function _sendmail($post_data, $settings)
    {
        $mail_setting = self::mail_setting($settings);

        if ($mail_setting['auto_line_break']) {
            // 1000バイト強制改行問題対策
            foreach ($post_data as $key => $value) {
                if (is_array($value)) {
                    continue;
                }
                $post_data[$key] = CustomUtility::_preventGarbledCharacters($post_data[$key]);
            }
        }

        $r = true;

        try {
            // メール変数
            $mailVars = array();
            $mailVars = compact('post_data');

            // 管理者へメール
            if ($r && ($mail_setting['subject_admin'] ?? '')) {
                $email = new Email('default');
                $email->setCharset('ISO-2022-JP');
                $email->setFrom([$mail_setting['from'] => $mail_setting['name']]);
                $email->setTo($mail_setting['to_admin']);
                $email->setSubject($mail_setting['subject_admin']);
                $email->setTemplate($mail_setting['template_admin']);
                $email->setViewVars($mailVars);
                $r = $email->send();
            }

            // ユーザーへメール
            if ($r && ($mail_setting['subject_user'] ?? '') && isset($post_data['email'])) {
                $email = new Email('default');
                $email->setCharset('ISO-2022-JP');
                $email->setFrom([$mail_setting['from'] => $mail_setting['name']]);
                $email->setTo($post_data['email']);
                $email->setSubject($mail_setting['subject_user']);
                $email->setTemplate($mail_setting['template_user']);
                $email->setViewVars($mailVars);
                $r = $email->send();
            }

            if (!$r) {
                throw new \Exception('Error Processing Request', 1);
            }
        } catch (\Exception $e) {
            throw new \Exception('メール送信失敗' . $e);
            exit;
        }

        return $r;
    }

    /**
     * テスト環境かどうかでメール設定を変更する。
     */
    public static function mail_setting($settings)
    {
        $setting = [];
        if (Configure::read('debug')) {
            $setting = $settings['test'] ?? [];
        } else {
            $setting = $settings['honban'] ?? [];
        }

        return array_merge(
            self::setting_default,
            $setting
        );
    }
}

/**
 *
 * 日付まわり
 *
 */
class ManageDate
{
    //様々な形式の日付をdate型にして返す。
    //format K == 令和　　X == 00(令和何年)
    public static function getDate($date = '', $format = '')
    {
        if ($date) {
            //2021年02月21日　=> 日本語フォーマットの日付をdatetime型に変換する
            if ((preg_match('/[0-9]{4}年[0-9]+月[0-9]+日/', $date))) {
                list($year, $other) = explode('年', $date);
                list($month, $other) = explode('月', $other);
                list($day, $other) = explode('日', $other);
                $date = $year . '-' . $month . '-' . $day;
            }

            try {
                $ddd = new \DateTime($date);
            } catch (\Exception $e) {
                $ddd = new \DateTime('0000-00-00');
            }
        } else {
            $ddd = new \DateTime();
        }

        if ($format) {
            if ($format == 'jp') {
                $week = array('日', '月', '火', '水', '木', '金', '土');
                $w = $week[$ddd->format('w')];
                return $ddd->format('Y年m月d日') . ' (' . $w . ') ' . $ddd->format('H:i');
            } else {
                // 元号一覧
                $era_list = [
                    // 令和(2019年5月1日〜)
                    [
                        'jp' => '令和', 'jp_abbr' => '令',
                        'en' => 'Reiwa', 'en_abbr' => 'R',
                        'time' => '20190501'
                    ],
                    // 平成(1989年1月8日〜)
                    [
                        'jp' => '平成', 'jp_abbr' => '平',
                        'en' => 'Heisei', 'en_abbr' => 'H',
                        'time' => '19890108'
                    ],
                    // 昭和(1926年12月25日〜)
                    [
                        'jp' => '昭和', 'jp_abbr' => '昭',
                        'en' => 'Showa', 'en_abbr' => 'S',
                        'time' => '19261225'
                    ],
                    // 大正(1912年7月30日〜)
                    [
                        'jp' => '大正', 'jp_abbr' => '大',
                        'en' => 'Taisho', 'en_abbr' => 'T',
                        'time' => '19120730'
                    ],
                    // 明治(1873年1月1日〜)
                    // ※明治5年以前は旧暦を使用していたため、明治6年以降から対応
                    [
                        'jp' => '明治', 'jp_abbr' => '明',
                        'en' => 'Meiji', 'en_abbr' => 'M',
                        'time' => '18730101'
                    ],
                ];

                $format_K = '';
                $format_k = '';
                $format_Q = '';
                $format_q = '';
                $format_X = $ddd->format('Y');
                $format_x = $ddd->format('y');

                foreach ($era_list as $era) {
                    $dt_era = new \DateTime($era['time']);
                    if ($ddd->format('Ymd') >= $dt_era->format('Ymd')) {
                        $format_K = $era['jp'];
                        $format_k = $era['jp_abbr'];
                        $format_Q = $era['en'];
                        $format_q = $era['en_abbr'];
                        $format_X = sprintf('%02d', $format_x = $ddd->format('Y') - $dt_era->format('Y') + 1);
                        break;
                    }
                }

                $result = '';

                foreach (str_split($format) as $val) {
                    // フォーマットが指定されていれば置換する
                    if (isset(${"format_{$val}"})) {
                        $result .= ${"format_{$val}"};
                    } else {
                        $result .= $ddd->format($val);
                    }
                }

                return $result;
            }
        }
        return $ddd;
    }

    //その月の初日
    public static function getMonthFirstDay($date, $format = 'Y-m-d')
    {
        $date = new Date(date('Y-m-d', strtotime('first day of ' . $date)));
        return $date->format($format);
    }

    //その月の末日
    public static function getMonthLastDay($date, $format = 'Y-m-d')
    {
        $date = new Date(date('Y-m-d', strtotime('last day of ' . $date)));
        return $date->format($format);
    }

    //次の日の取得
    public static function nextDay($date)
    {
        if (is_object($date)) {
            $ddd = $date;
        } else {
            $ddd = new \DateTime($date);
        }
        $ddd->modify('+1 days');
        return $ddd->format('Y-m-d');
    }

    //和暦の変換。　to_wareki('KX年', post_custom('cus_date'))
    public static function to_wareki($format, $time = 'now')
    {
        if (!$time) {
            return '';
        }
        // 元号一覧
        $era_list = [
            // 令和(2019年5月1日〜)
            [
                'jp' => '令和', 'jp_abbr' => '令',
                'en' => 'Reiwa', 'en_abbr' => 'R',
                'time' => '20190501'
            ],
            // 平成(1989年1月8日〜)
            [
                'jp' => '平成', 'jp_abbr' => '平',
                'en' => 'Heisei', 'en_abbr' => 'H',
                'time' => '19890108'
            ],
            // 昭和(1926年12月25日〜)
            [
                'jp' => '昭和', 'jp_abbr' => '昭',
                'en' => 'Showa', 'en_abbr' => 'S',
                'time' => '19261225'
            ],
            // 大正(1912年7月30日〜)
            [
                'jp' => '大正', 'jp_abbr' => '大',
                'en' => 'Taisho', 'en_abbr' => 'T',
                'time' => '19120730'
            ],
            // 明治(1873年1月1日〜)
            // ※明治5年以前は旧暦を使用していたため、明治6年以降から対応
            [
                'jp' => '明治', 'jp_abbr' => '明',
                'en' => 'Meiji', 'en_abbr' => 'M',
                'time' => '18730101'
            ],
        ];
        $dt = new \DateTime($time . '-01-01');

        $format_K = '';
        $format_k = '';
        $format_Q = '';
        $format_q = '';
        $format_X = $dt->format('Y');
        $format_x = $dt->format('y');

        foreach ($era_list as $era) {
            $dt_era = new \DateTime($era['time']);
            if ($dt->format('Ymd') >= $dt_era->format('Ymd')) {
                $format_K = $era['jp'];
                $format_k = $era['jp_abbr'];
                $format_Q = $era['en'];
                $format_q = $era['en_abbr'];
                $format_X = sprintf('%02d', $format_x = $dt->format('Y') - $dt_era->format('Y') + 1);
                break;
            }
        }

        $result = '';

        foreach (str_split($format) as $val) {
            // フォーマットが指定されていれば置換する
            if (isset(${"format_{$val}"})) {
                $result .= ${"format_{$val}"};
            } else {
                $result .= $dt->format($val);
            }
        }

        return $result;
    }
}

/**
 *
 * URLまわり
 *
 */
class ManageUrl
{
    public static function nowUrl()
    {
        return (empty($_SERVER['HTTPS']) ? 'http://' : 'https://') . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
    }

    //queryやクリアURLを配列で取得する
    public static function getUrlData($url = '')
    {
        $data = parse_url($url ? $url : self::nowUrl());

        if (!isset($data['scheme']) || !isset($data['host'])) {
            return '';
        }

        $url = $data['scheme'] . '://' . $data['host'] . $data['path'];
        $data['base_url'] = $url;

        //queryを配列にする
        parse_str(html_entity_decode($data['query'] ?? ''), $query);
        $data['queries'] = $query;

        return $data;
    }

    //queryを削除したurlを取得する
    public static function deleteUrlQuery($url = '', $deleteQueryKey = [])
    {
        $url_data = self::getUrlData($url);
        if (!$url_data) {
            return '';
        }
        extract($url_data);

        if (!$queries) {
            return $base_url;
        }
        foreach ($deleteQueryKey as $key) {
            unset($queries[$key]);
        }
        $query_url = http_build_query($queries);

        return $base_url . '?' . $query_url;
    }

    //queryを追加したurlを取得する
    public static function addUrlQuery($url = '', $addQueryData = [])
    {
        extract(self::getUrlData($url));
        if (!$queries && !$addQueryData) {
            return $base_url;
        }
        $queries = array_merge($queries, $addQueryData);
        $query_url = http_build_query($queries);
        return $base_url . '?' . $query_url;
    }
}

/**
 *
 * 都道府県周りのデータを管理
 *
 */
class ManagePrefectures
{
    public static function getAreaName($pref_slug)
    {
        $data = array_values(self::getPrefList([$pref_slug]));
        return $data[0] ?? '';
    }

    /**
     * 英字 => 日本語の都道府県リスト
     * [[tokyo => 東京],,, ]
     */
    public static function getPrefList($needle = null)
    {
        $datas = self::getPrefData($needle);
        return Hash::combine($datas, '{*}.en', '{*}.jp');
    }

    /**
     *
     * [[en => tokyo, jp => 東京],,, ]
     *
     * [ 2 => tokyo ] で配列を渡すと、[ tokyo => [en => tokyo, jp => 東京, id => 2, ],,, ]
     * で返す。
     */
    public static function getPrefData($needle = null)
    {
        $list = self::getJpAreaList($needle);
        if (!$list) {
            return [];
        }
        return array_reduce($list, function ($carry, $area) {
            $prefs = $area['prefs'] ?? [];
            return !$carry ? $prefs : (array_merge($carry, $prefs));
        });
    }

    /**
     * 　[ 関東 => [ tokyo => 東京 ] ]
     *
     * [ 2 => tokyo ] で配列を渡すと、　[ 関東 => [ 2 => 東京 ] ]
     * で返す。
     */
    public static function getAreaPrefOptgroupList($needle = null)
    {
        $list = self::getJpAreaList($needle);
        if (!$list) {
            return [];
        }

        //keyをidにする
        $is_id_key = !is_null($needle) && !isset($needle[0]);

        $datas = [];
        foreach ($list as $area) {
            $new_prefs = [];
            foreach ($area['prefs'] as $_ => $pref_data) {
                $index = $is_id_key ? $pref_data['id'] : $pref_data['en'];
                $new_prefs[$index] = $pref_data['jp'];
            }

            $datas[$area['area_jp']] = $new_prefs;
        }
        return $datas;
    }

    /**
     *
     * 必要な都道府県のみで構成する
     * [72 => tokyo]  >>>>>  [area_jp => 関東, prefs => [[en => tokyo, jp => 東京, id => 72 ],,,],,,,]
     *
     */
    public static function getJpAreaList($needle = null)
    {
        if (is_array($needle) && empty($needle)) {
            return [];
        }

        $is_index_array = isset($needle[0]);
        $need_slug_id_list = is_array($needle) ? array_flip($needle) : [];

        $needle_area_prefs = self::$jp_area_list;
        if (!is_null($needle)) {
            $needle_area_prefs = array_reduce(self::$jp_area_list, function ($total, $area) use ($need_slug_id_list) {
                $needle_prefs = array_filter($area['prefs'], function ($pref_data) use ($need_slug_id_list) {
                    return isset($need_slug_id_list[$pref_data['en']]);
                });
                if (!$needle_prefs) {
                    return $total;
                }

                $area['prefs'] = $needle_prefs;
                if (!$total) {
                    return [$area];
                }
                return array_merge($total, [$area]);
            });
        }

        if (!$needle_area_prefs) {
            return [];
        }

        $area_prefs = array_map(function ($area) use ($need_slug_id_list, $is_index_array) {
            //id付与する必要があれば
            $new_prefs = [];
            foreach (($area['prefs'] ?? []) as $pref) {
                $id = $is_index_array ? null : ($need_slug_id_list[$pref['en']] ?? 0);
                $new_prefs[$pref['en']] = array_merge($pref, [
                    'id' => $id,
                    'area_en' => $area['area_en'],
                    'area_jp' => $area['area_jp'],
                ]);
            }

            $area['prefs'] = $new_prefs;

            return $area;
        }, $needle_area_prefs);

        return $area_prefs;
    }

    //都道府県
    public static $jp_area_list = array(
        [
            'area_en' => 'hokkaido',
            'area_jp' => '北海道',
            'prefs' => [
                [
                    'en' => 'hokkaido',
                    'jp' => '北海道',
                ],
            ]
        ],
        [
            'area_en' => 'tohoku',
            'area_jp' => '東北',
            'prefs' => [
                [
                    'en' => 'aomori',
                    'jp' => '青森県',
                ],
                [
                    'en' => 'iwate',
                    'jp' => '岩手県',
                ],
                [
                    'en' => 'akita',
                    'jp' => '秋田県',
                ],
                [
                    'en' => 'miyagi',
                    'jp' => '宮城県',
                ],
                [
                    'en' => 'yamagata',
                    'jp' => '山形県',
                ],
                [
                    'en' => 'fukushima',
                    'jp' => '福島県',
                ],
            ]
        ],
        [
            'area_en' => 'kanto',
            'area_jp' => '関東',
            'prefs' => [
                [
                    'en' => 'ibaraki',
                    'jp' => '茨城県',
                ],
                [
                    'en' => 'tochigi',
                    'jp' => '栃木県',
                ],
                [
                    'en' => 'gunma',
                    'jp' => '群馬県',
                ],
                [
                    'en' => 'saitama',
                    'jp' => '埼玉県',
                ],
                [
                    'en' => 'chiba',
                    'jp' => '千葉県',
                ],
                [
                    'en' => 'tokyo',
                    'jp' => '東京都',
                ],
                [
                    'en' => 'kanagawa',
                    'jp' => '神奈川県',
                ],
            ]
        ],
        [
            'area_en' => 'chubu',
            'area_jp' => '中部',
            'prefs' => [
                [
                    'en' => 'yamanashi',
                    'jp' => '山梨県',
                ],
                [
                    'en' => 'nagano',
                    'jp' => '長野県',
                ],
                [
                    'en' => 'niigata',
                    'jp' => '新潟県',
                ],
                [
                    'en' => 'toyama',
                    'jp' => '富山県',
                ],
                [
                    'en' => 'ishikawa',
                    'jp' => '石川県',
                ],
                [
                    'en' => 'fukui',
                    'jp' => '福井県',
                ],
                [
                    'en' => 'shizuoka',
                    'jp' => '静岡県',
                ],
                [
                    'en' => 'aichi',
                    'jp' => '愛知県',
                ],
                [
                    'en' => 'gifu',
                    'jp' => '岐阜県',
                ],
            ]
        ],
        [
            'area_en' => 'kinki',
            'area_jp' => '近畿',
            'prefs' => [
                [
                    'en' => 'mie',
                    'jp' => '三重県',
                ],
                [
                    'en' => 'shiga',
                    'jp' => '滋賀県',
                ],
                [
                    'en' => 'kyoto',
                    'jp' => '京都府',
                ],
                [
                    'en' => 'oosaka',
                    'jp' => '大阪府',
                ],
                [
                    'en' => 'hyogo',
                    'jp' => '兵庫県',
                ],
                [
                    'en' => 'nara',
                    'jp' => '奈良県',
                ],
                [
                    'en' => 'wakayama',
                    'jp' => '和歌山県',
                ],
            ]
        ],
        [
            'area_en' => 'chubu',
            'area_jp' => '中国・四国',
            'prefs' => [
                [
                    'en' => 'tottori',
                    'jp' => '鳥取県',
                ],
                [
                    'en' => 'shimane',
                    'jp' => '島根県',
                ],
                [
                    'en' => 'okayama',
                    'jp' => '岡山県',
                ],
                [
                    'en' => 'hiroshima',
                    'jp' => '広島県',
                ],
                [
                    'en' => 'yamaguchi',
                    'jp' => '山口県',
                ],
                [
                    'en' => 'kagawa',
                    'jp' => '香川県',
                ],
                [
                    'en' => 'ehime',
                    'jp' => '愛媛県',
                ],
                [
                    'en' => 'tokushima',
                    'jp' => '徳島県',
                ],
                [
                    'en' => 'kochi',
                    'jp' => '高知県',
                ],
            ]
        ],
        [
            'area_en' => 'kyusyu',
            'area_jp' => '九州',
            'prefs' => [
                [
                    'en' => 'fukuoka',
                    'jp' => '福岡県',
                ],
                [
                    'en' => 'saga',
                    'jp' => '佐賀県',
                ],
                [
                    'en' => 'nagasaki',
                    'jp' => '長崎県',
                ],
                [
                    'en' => 'kumamoto',
                    'jp' => '熊本県',
                ],
                [
                    'en' => 'ooita',
                    'jp' => '大分県',
                ],
                [
                    'en' => 'miyazaki',
                    'jp' => '宮崎県',
                ],
                [
                    'en' => 'kagoshima',
                    'jp' => '鹿児島県',
                ],
                [
                    'en' => 'okinawa',
                    'jp' => '沖縄県',
                ],
            ]
        ],
    );
}
