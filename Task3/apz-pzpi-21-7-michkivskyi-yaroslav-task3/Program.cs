using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using apz_pzpi_21_7_michkivskyi_yaroslav_task3.Models;
using apz_pzpi_21_7_michkivskyi_yaroslav_task3.Services;

namespace apz_pzpi_21_7_michkivskyi_yaroslav_task3 {
    class Program {
        private static string fridgeId = "664f9ed8dce7af2d9d7a8837";
        private static string[] caseIds = new string[] { "664ca06657497809d9dbb53b"};

        static async Task Main(string[] args) {


            var temperatureIndicators = new List<TemperatureIndicator> { };
            
            for (int i = 0; i < caseIds.Length; i++) {
                temperatureIndicators.Add(new TemperatureIndicator(caseIds[i]));
            }

            var gpsService = new GpsService(fridgeId);
            var temperatureIndicatorsService = new TemperatureIndicatorsService(temperatureIndicators);

            gpsService.Start();
            temperatureIndicatorsService.Start();

            Console.WriteLine("Services started. Press any key to stop...");
            Console.ReadKey();

            gpsService.Stop();
            temperatureIndicatorsService.Stop();

            Console.WriteLine("Services stopped.");
        }
    }
}