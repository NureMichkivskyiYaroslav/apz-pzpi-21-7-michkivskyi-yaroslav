using apz_pzpi_21_7_michkivskyi_yaroslav_task3.Models;
using System.Threading.Tasks;
using System.Timers;

namespace apz_pzpi_21_7_michkivskyi_yaroslav_task3.Services {
    internal class GpsService {
        private readonly GpsModule _gpsModule;
        private readonly ApiService _apiService;
        private readonly Timer _timer;
        private readonly string fridgeId;

        public GpsService(string fridgeId) {
            _gpsModule = new GpsModule();
            _apiService = new ApiService();
            this.fridgeId = fridgeId;
            _timer = new Timer(5000);
            _timer.Elapsed += async (sender, e) => await SendGpsData();
        }

        public void Start() {
            _timer.Start();
        }

        public void Stop() {
            _timer.Stop();
        }

        private async Task SendGpsData() {
            var location = _gpsModule.GetLocation();
            var data = new {
                latitude = location[0],
                longitude = location[1]
            };

            await _apiService.SendGpsData(data, fridgeId);
        }
    }
}