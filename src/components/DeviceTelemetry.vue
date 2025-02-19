<template>
    <div class="p-6 bg-gray-100 min-h-screen">
      <h1 class="text-2xl font-semibold mb-4">Device Telemetry Dashboard</h1>
      <div class="grid grid-cols-1">
        <MultiLineChart v-if="chartData.length" 
                        :chartData="chartData" 
                        :options="chartOptions" 
                        class="h-[30rem]" />
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import axios from "axios";
  import moment from 'moment';
  import MultiLineChart from './MultiLineChart.vue';
  
  export default {
    data() {
      return {
        chartData: [] as Array<{ label: string; data: { xValue: string; yValue: number }[] }>,
        chartOptions: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: "#fff" } }
          },
          scales: {
            x: {
              ticks: { color: "#aaa" },
              grid: { color: "#444" }
            },
            y: {
              ticks: { color: "#aaa" },
              grid: { color: "#444" }
            }
          }
        }
      };
    },
    mounted() {
      this.fetchChartData();
    },
    methods: {
      async fetchChartData() {
        try {
          const { data } = await axios.get("https://localhost:44374/api/telemetry/device-metrics");
          console.log('data',data);
          this.chartData = this.formatChartData(data);
        } catch (error) {
          console.error("Error fetching chart data:", error);
        }
      },
      formatChartData(apiData: any) {
        if (!apiData?.entry?.resourceUsages || !Array.isArray(apiData.entry.resourceUsages)) return [];
  
        const formattedData = [
          { label: "CPU Usage", key: "cpuUsage" },
          { label: "Memory Usage", key: "memoryUsage" },
          { label: "Disk Usage", key: "diskUsage" },
          //{ label: "Network Usage", key: "networkUsage" },
          //{ label: "GPU Usage", key: "gpuUsage" },
          //{ label: "Battery Usage", key: "batteryUsage" }
        ].map(({ label, key }) => ({
          label,
          data: apiData.entry.resourceUsages.map((d: any) => ({
            xValue: moment(d?.date).format("HH:mm"),
            yValue: d?.[key] ?? 0 // Default to 0 if value is missing
          }))
        }));
        console.log('formattedData', formattedData);
        return formattedData;
      }
    }
  };
  </script>
  
  <style scoped>
  </style>
  