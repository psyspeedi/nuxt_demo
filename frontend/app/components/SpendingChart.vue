<template>
  <VCard rounded="lg" border>
    <VCardTitle class="text-subtitle-1 font-weight-medium">
      Расходы по месяцам
    </VCardTitle>
    <VCardText style="height: 240px;">
      <Bar :data="chartData" :options="chartOptions" style="max-height: 100%;" />
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { OrderStatus, type Order } from '~~/types/order'

const props = defineProps<{
  orders: Order[]
}>()

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const monthNames = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']

const chartData = computed(() => {
  const now = new Date()
  const monthsData: number[] = Array(6).fill(0)

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const month = date.getMonth()
    const year = date.getFullYear()

    const monthOrders = props.orders.filter(order => {
      if (order.status === OrderStatus.Cancelled) return false
      const orderDate = new Date(order.createdAt)
      return orderDate.getMonth() === month && orderDate.getFullYear() === year
    })

    monthsData[5 - i] = monthOrders.reduce((sum, o) => sum + o.totalAmount, 0)
  }

  const labels = monthsData.map((_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
    return monthNames[date.getMonth()]
  })

  return {
    labels,
    datasets: [
      {
        data: monthsData,
        backgroundColor: 'rgba(21, 101, 192, 0.7)',
        borderRadius: 6
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context: { raw: number }) => {
          return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            maximumFractionDigits: 0
          }).format(context.raw)
        }
      }
    }
  },
  scales: {
    y: {
      ticks: {
        callback: (value: number) => {
          if (value >= 1000) {
            return (value / 1000) + ' тыс.'
          }
          return value
        }
      }
    }
  }
}
</script>
