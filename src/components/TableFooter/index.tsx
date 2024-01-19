import { Pagination, Row } from 'antd';

export const TableFooter = ({ paginationProps }: any) => {
  return (<Row justify='space-between'>
    <div></div>
    <Pagination {...paginationProps} />
  </Row>);
};
