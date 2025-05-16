import { Col, DatePicker, Row, Select } from "antd";
import classNames from "classnames/bind";

import styles from "./ShowFilters.module.scss";

const cx = classNames.bind(styles);

function ShowFilters({ statusOptions = [] }) {
  return (
    <>
      <div className={cx("section")}>
        <Row gutter={[16, 16]} className={cx("filter-row")}>
          <Col xs={24} sm={12} md={6}>
            <div className={cx("filter-item")}>
              <label>Trạng thái</label>
              <Select
                options={statusOptions}
                defaultValue="all"
                style={{ width: "100%" }}
                onChange={(value) => console.log("Status filter:", value)}
              />
            </div>
          </Col>

          <Col xs={24} sm={24} md={12}>
            <div className={cx("filter item")}>
              <label>Thời gian tạo</label>
              <DatePicker.RangePicker
                style={{ width: "100%" }}
                onChange={(dates) => console.log("Date range:", dates)}
              />
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default ShowFilters;
