using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Timers;
using apz_pzpi_21_7_michkivskyi_yaroslav_task3.Models;

namespace apz_pzpi_21_7_michkivskyi_yaroslav_task3.Services {
    internal class TemperatureIndicatorsService {
        private readonly List<TemperatureIndicator> _temperatureIndicators;
        private readonly ApiService _apiService;
        private readonly Timer _timer;
        private List<TemperatureData> _failedData;

        public TemperatureIndicatorsService(List<TemperatureIndicator> temperatureIndicators) {
            _temperatureIndicators = temperatureIndicators;
            _apiService = new ApiService();
            _failedData = new List<TemperatureData>();
            _timer = new Timer(5000);
            _timer.Elapsed += async (sender, e) => await SendTemperatureData();
        }

        public void Start() {
            _timer.Start();
        }

        public void Stop() {
            _timer.Stop();
        }

        private async Task SendTemperatureData() {
            var data = _temperatureIndicators.Select(indicator => new TemperatureData {
                caseId = indicator.GetCaseId(),
                dateTime = DateTime.UtcNow,
                temperature = indicator.GetTemperature()
            }).ToList();

            if (_failedData.Any()) {
                data.AddRange(_failedData);
                _failedData.Clear();
            }

            string response = await _apiService.SendTemperatureData(data);
            Console.WriteLine(response);
            if (response == null) {
                _failedData.AddRange(data);
            }
            else {
                Console.WriteLine('1');
            }
        }

        private class TemperatureData {
            public string caseId {
                get; set;
            }
            public DateTime dateTime {
                get; set;
            }
            public double temperature {
                get; set;
            }
        }
    }
}