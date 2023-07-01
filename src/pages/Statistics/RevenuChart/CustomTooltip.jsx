import { formatMoney } from '@utils'

const CustomTooltip = (props) => {
  const { active, payload, label } = props
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: '#fff',
          padding: '10px',
          borderRadius: '6px',
        }}>
        <p className="label">{`${label} : ${formatMoney(payload[0].value)}`}</p>
      </div>
    )
  }
  return null
}

export default CustomTooltip
