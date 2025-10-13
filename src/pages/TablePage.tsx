import React from 'react';
import {
  EditableSchemaTable,
  ET,
  A
} from '@mi/schema-components';
import '@mi/schema-components/index.css';

// 模拟数据生成函数
const makeData = (count: number) => {
  const data = [];
  const genders = ['男', '女'];
  const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十'];
  
  for (let i = 0; i < count; i++) {
    const age = Math.floor(Math.random() * 50) + 18;
    const birthYear = new Date().getFullYear() - age;
    const birthMonth = Math.floor(Math.random() * 12) + 1;
    const birthDay = Math.floor(Math.random() * 28) + 1;
    
    data.push({
      id: i + 1,
      name: names[Math.floor(Math.random() * names.length)] + (i + 1),
      age: age,
      birthDate: `${birthYear}-${birthMonth.toString().padStart(2, '0')}-${birthDay.toString().padStart(2, '0')}`,
      gender: genders[Math.floor(Math.random() * genders.length)],
      department: ['技术部', '产品部', '运营部', '市场部'][Math.floor(Math.random() * 4)]
    });
  }
  
  return data;
};

const TablePage: React.FC = () => {
  const tableCtxRef = React.useRef<any>(null);

  // 表格字段配置
  const tableFields = [
    ET('序号', '_idx_').RowIndex().W(60).Fixed('left').val,
    ET('姓名', 'name')
      .Text()
      .Required('请输入姓名')
      .Placeholder('请输入姓名')
      .W(120)
      .Filter()
      .Sorter()
      .val,
    ET('年龄', 'age')
      .Number({ min: 0, max: 120 })
      .Required('请输入年龄')
      .Placeholder('请输入年龄')
      .W(80)
      .Filter()
      .Sorter()
      .val,
    ET('出生日期', 'birthDate')
      .Date({ format: 'YYYY-MM-DD' })
      .Required('请选择出生日期')
      .Placeholder('请选择出生日期')
      .W(140)
      .Filter()
      .Sorter()
      .val,
    ET('性别', 'gender')
      .Select({
        data: [
          { id: '男', title: '男' },
          { id: '女', title: '女' }
        ]
      })
      .Required('请选择性别')
      .Placeholder('请选择性别')
      .W(80)
      .Filter({ type: 'select' })
      .val,
    ET('部门', 'department')
      .RO()
      .W(100)
      .Filter({ type: 'select' })
      .val
  ];

  // 模拟数据
  const defaultData = makeData(1000);

  // 处理数据变更
  const handleValuesChange = (changed: any, allValues: any) => {
    console.log('数据变更:', changed);
    console.log('所有数据:', allValues);
  };

  // 处理行操作
  const handleRowOperation = (action: string, rowData: any) => {
    console.log('行操作:', action, rowData);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>人员信息管理表格</h2>
      <p>支持虚拟列表和分组功能的人员信息管理表格</p>
      
      <div style={{ height: 'calc(100vh - 200px)' }}>
        <EditableSchemaTable
          fields={tableFields}
          defaultValue={defaultData}
          innerCtxRef={tableCtxRef}
          virtualize
          grouping={{
            enable: true,
            groupBy: ['department', 'gender'],
            defaultExpanded: true
          }}
          sticky
          rowKey="id"
          rowSelection={{
            type: 'checkbox',
            enableClickSelect: true,
            enableIndicator: {
              enableOnlyShowSelected: true,
              formatter: (count) => `已选择 ${count} 项`
            }
          }}
          rowOperation={{
            buttons: [
              A.EditTableRow('编辑').onClick((rowData) => {
                handleRowOperation('edit', rowData);
              }).val,
              A.EditTableRow('删除').onClick((rowData) => {
                handleRowOperation('delete', rowData);
              }).val
            ]
          }}
          pagination={{
            pageSize: 50,
            pageSizeOptions: [20, 50, 100, 200],
            showTotal: true,
          }}
          onValuesChange={handleValuesChange}
        />
      </div>
    </div>
  );
};

export default TablePage; 