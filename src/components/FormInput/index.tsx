import { Input } from 'antd';

const FormInput = (props: any) => {
  const { title, placeHoder, error, value, onChange, onBlur, type="text", allowClear=true } = props;
  return (
    <div className='mb-6'>
      <div className='mb-2'>{title}</div>
      <Input 
        placeholder={placeHoder}
        className="rounded-lg h-10"
        allowClear={allowClear}
        onChange={onChange}
        value={value}
        onBlur={onBlur}
        type={type}
      />
      <div className='text-red-500 mt-2'>{error}</div>
    </div>
  )
}

export default FormInput