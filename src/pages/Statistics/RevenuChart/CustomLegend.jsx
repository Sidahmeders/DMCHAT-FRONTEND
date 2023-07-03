import { Button, HStack, FormControl, FormLabel, Switch } from '@chakra-ui/react'

import RangeMonthPicker from '@components/DatePicker/RangeMonthPicker'
import DatePicker from '@components/DatePicker/DatePicker'

const CustomLegend = ({
  showEmptyDays,
  setShowEmptyDays,
  selectedStat,
  setSelectedStat,
  dateRangeValue,
  setDateRangeValue,
}) => {
  return (
    <HStack display="flex" justifyContent="space-between" ml="14" mb="4">
      <HStack>
        <Button
          size="sm"
          colorScheme="twitter"
          variant={selectedStat.month ? 'solid' : 'ghost'}
          onClick={() => setSelectedStat({ month: true })}>
          Mois Revenu
        </Button>
        <Button
          size="sm"
          colorScheme="purple"
          variant={selectedStat.year ? 'solid' : 'ghost'}
          onClick={() => setSelectedStat({ year: true })}>
          Année Revenu
        </Button>
      </HStack>

      {selectedStat.year ? (
        <RangeMonthPicker
          className="year-range-picker"
          rangeValue={dateRangeValue}
          onChange={(newValue) => setDateRangeValue(newValue)}
        />
      ) : (
        <HStack>
          <FormControl display="flex" alignItems="center" mr="4">
            <FormLabel htmlFor="show-empty-days" fontSize="xs" mr="1" mb="0">
              afficher jours vides?
            </FormLabel>
            <Switch
              size="sm"
              id="show-empty-days"
              colorScheme="yellow"
              checked={showEmptyDays}
              onChange={() => setShowEmptyDays(!showEmptyDays)}
            />
          </FormControl>
          <DatePicker withPortal showMonthYearPicker dateFormat="yyyy/MM" className="month-range-picker" />
        </HStack>
      )}
    </HStack>
  )
}

export default CustomLegend
