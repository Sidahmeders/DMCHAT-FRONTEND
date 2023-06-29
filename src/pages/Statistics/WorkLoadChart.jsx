import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip } from 'recharts'

const data01 = [
  { week: '1', index: 1, value: 23 },
  { week: '2', index: 1, value: 54 },
  { week: '3', index: 1, value: 32 },
  { week: '4', index: 1, value: 37 },
  { week: '5', index: 1, value: 47 },
  { week: '6', index: 1, value: 25 },
  { week: '7', index: 1, value: 11 },
  { week: '8', index: 1, value: 19 },
  { week: '9', index: 1, value: 9 },
  { week: '10', index: 1, value: 36 },
  { week: '11', index: 1, value: 29 },
  { week: '12', index: 1, value: 56 },
  { week: '13', index: 1, value: 32 },
  { week: '14', index: 1, value: 15 },
  { week: '15', index: 1, value: 6 },
  { week: '16', index: 1, value: 45 },
  { week: '17', index: 1, value: 15 },
  { week: '18', index: 1, value: 27 },
  { week: '19', index: 1, value: 24 },
  { week: '20', index: 1, value: 17 },
  { week: '21', index: 1, value: 28 },
  { week: '22', index: 1, value: 46 },
  { week: '23', index: 1, value: 43 },
  { week: '24', index: 1, value: 23 },
  { week: '25', index: 1, value: 0 },
  { week: '26', index: 1, value: 0 },
  { week: '27', index: 1, value: 0 },
  { week: '28', index: 1, value: 0 },
  { week: '29', index: 1, value: 0 },
  { week: '30', index: 1, value: 0 },
  { week: '31', index: 1, value: 0 },
  { week: '32', index: 1, value: 0 },
  { week: '33', index: 1, value: 0 },
  { week: '34', index: 1, value: 0 },
  { week: '35', index: 1, value: 0 },
  { week: '36', index: 1, value: 0 },
  { week: '37', index: 1, value: 0 },
  { week: '38', index: 1, value: 0 },
  { week: '39', index: 1, value: 0 },
  { week: '40', index: 1, value: 0 },
  { week: '41', index: 1, value: 0 },
  { week: '42', index: 1, value: 0 },
  { week: '43', index: 1, value: 0 },
  { week: '44', index: 1, value: 0 },
  { week: '45', index: 1, value: 0 },
  { week: '46', index: 1, value: 0 },
  { week: '47', index: 1, value: 0 },
  { week: '48', index: 1, value: 0 },
  { week: '49', index: 1, value: 0 },
  { week: '50', index: 1, value: 0 },
  { week: '51', index: 1, value: 0 },
  { week: '52', index: 1, value: 0 },
]

const data02 = [
  { week: '1', index: 1, value: 1 },
  { week: '2', index: 1, value: 1 },
  { week: '3', index: 1, value: 1 },
  { week: '4', index: 1, value: 1 },
  { week: '5', index: 1, value: 2 },
  { week: '6', index: 1, value: 3 },
  { week: '7', index: 1, value: 1 },
  { week: '8', index: 1, value: 2 },
  { week: '9', index: 1, value: 1 },
  { week: '10', index: 1, value: 5 },
  { week: '11', index: 1, value: 6 },
  { week: '12', index: 1, value: 6 },
  { week: '13', index: 1, value: 8 },
  { week: '14', index: 1, value: 4 },
  { week: '15', index: 1, value: 6 },
  { week: '16', index: 1, value: 4 },
  { week: '17', index: 1, value: 5 },
  { week: '18', index: 1, value: 6 },
  { week: '19', index: 1, value: 8 },
  { week: '20', index: 1, value: 6 },
  { week: '21', index: 1, value: 3 },
  { week: '22', index: 1, value: 4 },
  { week: '23', index: 1, value: 6 },
  { week: '24', index: 1, value: 8 },
]

const parseDomain = () => [
  0,
  Math.max(
    Math.max.apply(
      null,
      data01.map((entry) => entry.value),
    ),
    Math.max.apply(
      null,
      data02.map((entry) => entry.value),
    ),
  ),
]

const renderTooltip = (props) => {
  const { active, payload } = props

  if (active && payload && payload.length) {
    const data = payload[0] && payload[0].payload

    return (
      <div
        style={{
          backgroundColor: '#fff',
          border: '1px solid #999',
          margin: 0,
          padding: 10,
        }}>
        <p>{data.week}</p>
        <p>
          <span>value: </span>
          {data.value}
        </p>
      </div>
    )
  }

  return null
}

const WorkLoadChart = () => {
  const domain = parseDomain()
  const range = [16, 225]

  return (
    <div style={{ overflowX: 'auto', width: '900px' }}>
      <ScatterChart width={2200} height={60} margin={{ top: 12 }}>
        <XAxis
          type="category"
          dataKey="week"
          interval={0}
          tick={{ fontSize: 0 }}
          tickLine={{ transform: 'translate(0, -6)' }}
        />
        <YAxis
          type="number"
          dataKey="index"
          name="dimanche"
          height={10}
          width={80}
          tick={false}
          tickLine={false}
          axisLine={false}
          label={{ value: 'dimanche', position: 'insideRight' }}
        />
        <ZAxis type="number" dataKey="value" domain={domain} range={range} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={renderTooltip} />
        <Scatter data={data01} fill="#8884d8" />
      </ScatterChart>

      <ScatterChart width={2200} height={60} margin={{ top: 12 }}>
        <XAxis
          type="category"
          dataKey="week"
          name="week"
          interval={0}
          tick={{ fontSize: 0 }}
          tickLine={{ transform: 'translate(0, -6)' }}
        />
        <YAxis
          type="number"
          dataKey="index"
          height={10}
          width={80}
          tick={false}
          tickLine={false}
          axisLine={false}
          label={{ value: 'lundi', position: 'insideRight' }}
        />
        <ZAxis type="number" dataKey="value" domain={domain} range={range} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={renderTooltip} />
        <Scatter data={data02} fill="#8884d8" />
      </ScatterChart>

      <ScatterChart width={2200} height={60} margin={{ top: 12 }}>
        <XAxis
          type="category"
          dataKey="week"
          name="week"
          interval={0}
          tick={{ fontSize: 0 }}
          tickLine={{ transform: 'translate(0, -6)' }}
        />
        <YAxis
          type="number"
          dataKey="index"
          height={10}
          width={80}
          tick={false}
          tickLine={false}
          axisLine={false}
          label={{ value: 'mardi', position: 'insideRight' }}
        />
        <ZAxis type="number" dataKey="value" domain={domain} range={range} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={renderTooltip} />
        <Scatter data={data01} fill="#8884d8" />
      </ScatterChart>

      <ScatterChart width={2200} height={60} margin={{ top: 12 }}>
        <XAxis
          type="category"
          dataKey="week"
          name="week"
          interval={0}
          tick={{ fontSize: 0 }}
          tickLine={{ transform: 'translate(0, -6)' }}
        />
        <YAxis
          type="number"
          dataKey="index"
          height={10}
          width={80}
          tick={false}
          tickLine={false}
          axisLine={false}
          label={{ value: 'mercredi', position: 'insideRight' }}
        />
        <ZAxis type="number" dataKey="value" domain={domain} range={range} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={renderTooltip} />
        <Scatter data={data02} fill="#8884d8" />
      </ScatterChart>

      <ScatterChart width={2200} height={60} margin={{ top: 12 }}>
        <XAxis
          type="category"
          dataKey="week"
          name="week"
          interval={0}
          tick={{ fontSize: 0 }}
          tickLine={{ transform: 'translate(0, -6)' }}
        />
        <YAxis
          type="number"
          dataKey="index"
          height={10}
          width={80}
          tick={false}
          tickLine={false}
          axisLine={false}
          label={{ value: 'jeudi', position: 'insideRight' }}
        />
        <ZAxis type="number" dataKey="value" domain={domain} range={range} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={renderTooltip} />
        <Scatter data={data01} fill="#8884d8" />
      </ScatterChart>

      <ScatterChart width={2200} height={60} margin={{ top: 12 }}>
        <XAxis
          type="category"
          dataKey="week"
          name="week"
          interval={0}
          tick={{ fontSize: 0 }}
          tickLine={{ transform: 'translate(0, -6)' }}
        />
        <YAxis
          type="number"
          dataKey="index"
          height={10}
          width={80}
          tick={false}
          tickLine={false}
          axisLine={false}
          label={{ value: 'vendredi', position: 'insideRight' }}
        />
        <ZAxis type="number" dataKey="value" domain={domain} range={range} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={renderTooltip} />
        <Scatter data={data02} fill="#8884d8" />
      </ScatterChart>

      <ScatterChart width={2200} height={60} margin={{ top: 12 }}>
        <XAxis type="category" dataKey="week" name="week" interval={0} tickLine={{ transform: 'translate(0, -6)' }} />
        <YAxis
          type="number"
          dataKey="index"
          height={10}
          width={80}
          tick={false}
          tickLine={false}
          axisLine={false}
          label={{ value: 'samedi', position: 'insideRight' }}
        />
        <ZAxis type="number" dataKey="value" domain={domain} range={range} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={renderTooltip} />
        <Scatter data={data01} fill="#8884d8" />
      </ScatterChart>
    </div>
  )
}

export default WorkLoadChart
