<?php
function html_decode($text)
{
    return html_entity_decode(h($text));
}


function getExtension($filename)
{
    return strtolower(substr(strrchr($filename, '.'), 1));
}


function getDateInMonthForCalendar($date = 'now')
{

    if ($date != 'now') {
        $dateTime = \DateTime::createFromFormat('Y-m-d', $date);
        $errors = \DateTime::getLastErrors();
        if (!$dateTime || !empty($errors['warning_count']))
            $date = 'now';
    }

    $obj_date = new DateTime($date);
    $first_date = $obj_date->format('Y-m-01');
    $last_date = date("Y-m-t", strtotime($first_date));

    $start_day_of_week = intval((new DateTime($first_date))->format('w'));
    $last_day_of_week = intval((new DateTime($last_date))->format('w'));

    $start = new DateTime($first_date . ' -' . $start_day_of_week . ' day');
    $end = new DateTime($last_date . ' +' . (6 - $last_day_of_week) . ' day');

    $reriod = new DatePeriod(
        new DateTime($start->format('Y-m-d')),
        new DateInterval('P1D'),
        new DateTime($end->format('Y-m-d') . ' + 1 day')
    );

    $list_date = [];
    $week_list = [];
    $i = 1;
    foreach ($reriod as $key => $value) {
        $week_list[$value->format('Ymd')] = $value;
        if ($i % 7 == 0) {
            $list_date[] = $week_list;
            $week_list = [];
        }
        $i++;
    }
    $preMonth = new DateTime($first_date);
    $preMonth->modify('-1month');

    $nextMonth = new DateTime($first_date);
    $nextMonth->modify('+1month');

    return [
        'daysOfCurrentMonth' => $list_date,
        'currentDay' => $obj_date,
        'nextMonth' => $nextMonth,
        'preMonth' => $preMonth
    ];
}
