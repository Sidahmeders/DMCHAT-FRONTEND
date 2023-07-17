const CustomTooltip = (props) => {
  const { active, payload } = props
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: '#fff',
          padding: '10px',
          borderRadius: '6px',
        }}>
        <p className="label">{payload[0]?.value} patients</p>
      </div>
    )
  }
  return null
}

export default CustomTooltip
