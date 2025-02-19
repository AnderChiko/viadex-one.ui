<template>
    <div class="card">
        <Chart v-if="chartData" type="line" :data="chartData" :options="chartOptions" class="h-[30rem]" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import moment from "moment";

const chartData = ref(null);
const chartOptions = ref(null);

onMounted(async () => {
    await fetchChartData();
    //chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});

const fetchChartData = async () => {
    try {
        const {data } = await axios.get("https://localhost:44374/api/telemetry/device-metrics");
        console.log('data', data);
        chartData.value = formatChartData(data);
        
    } catch (error) {
        console.error("Error fetching chart data:", error);
    }
};

const formatChartData = (apiData) => {
    const documentStyle = getComputedStyle(document.documentElement);
    console.log('apiData', apiData);

    const labels = apiData.entry.resourceUsages.map(d => moment(d.date).format("HH:mm"));
    const arrCpuUsage = apiData.entry.resourceUsages.map(d => d.cpuUsage);
    const arrDiskUsage = apiData.entry.resourceUsages.map(d => d.diskUsage);
    const arrMemoryUsage = apiData.entry.resourceUsages.map(d => d.memoryUsage);

    return {
        labels: labels,
        datasets:[  {
                label: 'CPU Usage %',
                fill: false,
                borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
                yAxisID: 'y',
                tension: 0.4,
                data: arrCpuUsage
            },
            {
                label: 'Disk Usage (%)',
                fill: false,
                borderColor: documentStyle.getPropertyValue('--p-gray-500'),
                yAxisID: 'y1',
                tension: 0.4,
                data: arrDiskUsage
            },
            {
                label: 'Memory Usage (%)',
                fill: false,
                borderColor: documentStyle.getPropertyValue('--p-green-500'),
                yAxisID: 'y1',
                tension: 0.4,
                data: arrMemoryUsage
            }
        ]
    };
};

const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    return {
        stacked: false,
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            },
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    drawOnChartArea: false,
                    color: surfaceBorder
                }
            }
        }
    };
};
</script>
