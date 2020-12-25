import { DatePicker } from 'antd';
import React from 'react';

export default () => {
    const { RangePicker } = DatePicker;
    const changeDate = (value: Array<any>, dateString: Array<String>) => {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
    }

    const dateOk = (value: Array<any>) => {
        console.log('onOk: ', value[0].format('X'), value[1]);
    }
    return (<RangePicker
        showTime={{ format: 'HH:mm' }}
        format="YYYY-MM-DD HH:mm"
        onChange={changeDate}
        onOk={dateOk}
    />)
}