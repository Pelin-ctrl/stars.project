import { useState, useEffect } from "react";
import { Pie, PieChart, ResponsiveContainer, Cell, Legend } from "recharts";
import { TrendingUp } from "lucide-react";

function App() {
  const [currentPage, setCurrentPage] = useState("welcome");
  const [selectedFormat, setSelectedFormat] = useState("api");
  const [targetPage, setTargetPage] = useState("");
  const [startDate, setStartDate] = useState("2023-09-12");
  const [endDate, setEndDate] = useState("2023-11-12");
  const [searchINN, setSearchINN] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    if (currentPage === "success") {
      const timer = setTimeout(() => {
        setCurrentPage("welcome");
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [currentPage]);

  const handleSubmit = () => {
    setCurrentPage("success");
  };

  const handleAuthRequest = (destination) => {
    setTargetPage(destination);
    setCurrentPage("auth");
  };

  const handleLogin = () => {
    setCurrentPage(targetPage);
  };

  const formatDateRange = (start, end) => {
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    const options = { month: "short", day: "numeric", year: "2-digit" };

    const startFormatted = startDateObj.toLocaleDateString("ru-RU", options);
    const endFormatted = endDateObj.toLocaleDateString("ru-RU", options);

    const daysDiff = Math.ceil(
      (endDateObj - startDateObj) / (1000 * 60 * 60 * 24)
    );

    return {
      days: daysDiff,
      range: `${startFormatted} - ${endFormatted}`,
    };
  };

  const companyData = [
    {
      inn: "781633333333",
      name: 'Акционерное общество "Свобода"',
      status: "Действующая",
      productionAddress: "127015, г. Москва, ул. Вятская, д. 47 стр. 8",
      legalAddress:
        "127015, г. Москва, ул. Вятская, д. 47 стр. 8 этаж 4 пом. 45-46",
      industry: "Химическая промышленность",
      registrationDate: "9/3/2018",
    },
    {
      inn: "7721840520",
      name: 'ООО "РУ КМЗ"',
      status: "Действующая",
      productionAddress: "127015, г. Москва, ул. Вятская, д. 47 стр. 8",
      legalAddress:
        "127015, г. Москва, ул. Вятская, д. 47 стр. 8 этаж 4 пом. 45-46",
      industry: "Химическая промышленность",
      registrationDate: "9/3/2018",
    },
    {
      inn: "7715034360",
      name: 'АО "ОМПК"',
      status: "Действующая",
      productionAddress: "127015, г. Москва, ул. Вятская, д. 47 стр. 8",
      legalAddress:
        "127015, г. Москва, ул. Вятская, д. 47 стр. 8 этаж 4 пом. 45-46",
      industry: "Химическая промышленность",
      registrationDate: "9/3/2018",
    },
    {
      inn: "7713085659",
      name: 'АО "ВБД"',
      status: "Действующая",
      productionAddress: "127015, г. Москва, ул. Вятская, д. 47 стр. 8",
      legalAddress:
        "127015, г. Москва, ул. Вятская, д. 47 стр. 8 этаж 4 пом. 45-46",
      industry: "Химическая промышленность",
      registrationDate: "9/3/2018",
    },
    {
      inn: "7723006328",
      name: 'АО "ГАЗПРОМНЕФТЬ - МНПЗ"',
      status: "Действующая",
      productionAddress: "127015, г. Москва, ул. Вятская, д. 47 стр. 8",
      legalAddress:
        "127015, г. Москва, ул. Вятская, д. 47 стр. 8 этаж 4 пом. 45-46",
      industry: "Химическая промышленность",
      registrationDate: "9/3/2018",
    },
    {
      inn: "7724774770",
      name: 'ООО "ДОБРОЛЕК"',
      status: "Действующая",
      productionAddress: "127015, г. Москва, ул. Вятская, д. 47 стр. 8",
      legalAddress:
        "127015, г. Москва, ул. Вятская, д. 47 стр. 8 этаж 4 пом. 45-46",
      industry: "Химическая промышленность",
      registrationDate: "9/3/2018",
    },
    {
      inn: "7735007358",
      name: 'АО "Микрон"',
      status: "Действующая",
      productionAddress: "127015, г. Москва, ул. Вятская, д. 47 стр. 8",
      legalAddress:
        "127015, г. Москва, ул. Вятская, д. 47 стр. 8 этаж 4 пом. 45-46",
      industry: "Химическая промышленность",
      registrationDate: "9/3/2018",
    },
    {
      inn: "7708029391",
      name: 'АО "КОНДИТЕРСКИЙ КОНЦЕРН БАБАЕВСКИЙ"',
      status: "Действующая",
      productionAddress: "127015, г. Москва, ул. Вятская, д. 47 стр. 8",
      legalAddress:
        "127015, г. Москва, ул. Вятская, д. 47 стр. 8 этаж 4 пом. 45-46",
      industry: "Химическая промышленность",
      registrationDate: "9/3/2018",
    },
    {
      inn: "7709259743",
      name: 'АО МАЗ "МОСКВИЧ"',
      status: "Действующая",
      productionAddress: "127015, г. Москва, ул. Вятская, д. 47 стр. 8",
      legalAddress:
        "127015, г. Москва, ул. Вятская, д. 47 стр. 8 этаж 4 пом. 45-46",
      industry: "Химическая промышленность",
      registrationDate: "9/3/2018",
    },
    {
      inn: "7724685256",
      name: 'ООО "НПП "ИТЭЛМА"',
      status: "Действующая",
      productionAddress: "127015, г. Москва, ул. Вятская, д. 47 стр. 8",
      legalAddress:
        "127015, г. Москва, ул. Вятская, д. 47 стр. 8 этаж 4 пом. 45-46",
      industry: "Химическая промышленность",
      registrationDate: "9/3/2018",
    },
  ];

  const filteredCompanies = companyData.filter((company) =>
    company.inn.includes(searchINN)
  );

  const WelcomePage = () => (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="flex items-center gap-4 mb-16">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-2 border-gray-400 w-12 h-12 top-2 left-2"></div>
          <div className="absolute inset-0 bg-gray-800 w-12 h-12 transform rotate-45 top-2 left-2">
            <div className="absolute inset-3 border border-white"></div>
          </div>
        </div>
        <div className="text-left">
          <h1 className="text-2xl font-bold text-black">ИНДУСТИАЛЬНЫЕ</h1>
          <p className="text-lg text-gray-600">данные Москвы</p>
        </div>
      </div>

      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
          Добро пожаловать
        </h2>
        <h3 className="text-3xl md:text-4xl font-bold text-black">
          в Индустиальные данные Москвы
        </h3>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => handleAuthRequest("dashboard")}
          className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
        >
          Руководству ДИПП
        </button>
        <button
          onClick={() => handleAuthRequest("enterprise")}
          className="bg-white text-black border-2 border-gray-300 px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors"
        >
          Партнерам
        </button>
      </div>
    </div>
  );

  const AuthPage = () => (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="flex items-center gap-4 mb-16">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-2 border-gray-400 w-12 h-12 top-2 left-2"></div>
          <div className="absolute inset-0 bg-gray-800 w-12 h-12 transform rotate-45 top-2 left-2">
            <div className="absolute inset-3 border border-white"></div>
          </div>
        </div>
        <div className="text-left">
          <h1 className="text-2xl font-bold text-black">ИНДУСТИАЛЬНЫЕ</h1>
          <p className="text-lg text-gray-600">данные Москвы</p>
        </div>
      </div>

      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold text-black text-center mb-12">
          Авторизация
        </h2>

        <div className="space-y-4 mb-8">
          <input
            type="text"
            placeholder="Логин"
            className="w-full bg-gray-200 text-gray-700 px-6 py-4 rounded-full placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <input
            type="password"
            placeholder="Пароль"
            className="w-full bg-gray-200 text-gray-700 px-6 py-4 rounded-full placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleLogin}
            className="bg-black text-white px-12 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
          >
            Войти
          </button>
          <button className="text-gray-500 hover:text-gray-700 transition-colors">
            Забыли пароль?
          </button>
        </div>
      </div>
    </div>
  );

  const EnterprisePage = () => (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-black text-center mb-12">
          Индустиальные данные Москвы
        </h1>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-black mb-6">
              Введите данные предприятия
            </h2>

            <div className="mb-4">
              <div className="relative">
                <select className="w-full bg-gray-200 text-black px-4 py-3 rounded-md appearance-none cursor-pointer">
                  <option>выберите отрасль</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-black"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <input
                type="text"
                placeholder="Название предприятия"
                className="w-full bg-gray-200 text-gray-500 px-4 py-3 rounded-md placeholder-gray-500"
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-black mb-6">
              Выберите формат загрузки данных
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={() => setSelectedFormat("api")}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  selectedFormat === "api"
                    ? "bg-white border-2 border-black text-black"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                API
              </button>
              <button
                onClick={() => setSelectedFormat("excel")}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  selectedFormat === "excel"
                    ? "bg-white border-2 border-black text-black"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                Excel
              </button>
              <button
                onClick={() => setSelectedFormat("manual")}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  selectedFormat === "manual"
                    ? "bg-white border-2 border-black text-black"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                Ручной ввод
              </button>
            </div>

            {selectedFormat === "api" && (
              <div className="mb-8">
                <input
                  type="text"
                  placeholder="введите API ключ"
                  className="w-full bg-gray-200 text-black px-4 py-3 rounded-md border-2 border-black placeholder-gray-600"
                />
              </div>
            )}

            {selectedFormat === "excel" && (
              <div className="mb-8">
                <div className="w-full bg-gray-200 px-4 py-8 rounded-md border-2 border-dashed border-gray-400 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-gray-600 rounded mr-3 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-black font-medium">
                      прикрепите файл
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center pt-8">
            <button
              onClick={handleSubmit}
              className="bg-gray-800 text-white px-12 py-3 rounded-md font-medium hover:bg-gray-700 transition-colors"
            >
              Отправить
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const SuccessPage = () => (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-black text-center mb-12">
          Индустиальные данные Москвы
        </h1>

        <div className="bg-gray-300 rounded-lg p-16 text-center">
          <h2 className="text-4xl font-bold text-black mb-6">Спасибо!</h2>
          <p className="text-2xl text-black">Данные загружены успешно</p>
        </div>
      </div>
    </div>
  );

  const CompanyDetailPage = ({ company }) => (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 bg-gray-200 min-h-screen">
        <div className="p-4">
          <div className="bg-white p-4 rounded-lg mb-8">
            <div className="flex items-center gap-6">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 border-2 border-gray-400 w-8 h-8 top-1 left-0"></div>
                <div className="absolute inset-0 bg-gray-800 w-8 h-8 transform rotate-45 top-1 left-0">
                  <div className="absolute inset-2 border border-white"></div>
                </div>
              </div>
              <div>
                <div className="text-base font-bold text-black">
                  ИНДУСТИАЛЬНЫЕ
                </div>
                <div className="text-sm text-gray-600">данные Москвы</div>
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            <div
              className="px-3 py-3 rounded flex items-center gap-3 text-gray-600 hover:bg-gray-300 cursor-pointer"
              onClick={() => setCurrentPage("dashboard")}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              <span className="text-base">Дашборд</span>
            </div>
            <div className="bg-gray-300 px-3 py-3 rounded flex items-center gap-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-base">Данные о компаниях</span>
            </div>
            <div className="px-3 py-3 rounded flex items-center gap-3 text-gray-600 hover:bg-gray-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 17v-2.25A2.25 2.25 0 0011.25 12h2.5A2.25 2.25 0 0016 14.25V17M9 17H7a2 2 0 01-2-2v-6a2 2 0 012-2h10a2 2 0 012 2v6a2 2 0 01-2 2h-2M9 17v-10" />
              </svg>
              <span className="text-base">Отчеты</span>
            </div>
            <div className="px-3 py-3 rounded flex items-center gap-3 text-gray-600 hover:bg-gray-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-base">Настройки</span>
            </div>
            <div className="px-3 py-3 rounded flex items-center gap-3 text-gray-600 hover:bg-gray-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-base">Помощь</span>
            </div>
          </nav>
        </div>
      </div>

      <div className="flex-1">
        <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-black">Данные о компаниях</h1>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300">
              <img
                src="/profile-avatar.jpg"
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <div
                className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center"
                style={{ display: "none" }}
              >
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <div className="relative">
              <div className="w-10 h-10 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">3</span>
              </div>
            </div>

            <div className="w-10 h-10 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Введите ИНН компании"
                  value={company.inn}
                  readOnly
                  className="bg-gray-200 text-black px-4 py-2 rounded-md w-80"
                />
              </div>
              <button className="bg-white border border-gray-300 text-black px-6 py-2 rounded-md flex items-center gap-2 hover:bg-gray-50">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
                Поиск
              </button>
            </div>
            <button
              onClick={() => setCurrentPage("companydata")}
              className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
            >
              ← Назад к списку
            </button>
          </div>

          <div className="bg-white rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-black mb-4">АО "СВОБОДА"</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-[200px_1fr] gap-4">
                <span className="text-gray-700 font-medium">
                  Полное наименование
                </span>
                <span className="text-black">
                  АКЦИОНЕРНОЕ ОБЩЕСТВО "СВОБОДА"
                </span>
              </div>
              <div className="grid grid-cols-[200px_1fr] gap-4">
                <span className="text-gray-700 font-medium">
                  Дата регистрации
                </span>
                <span className="text-black">03.09.2018</span>
              </div>
              <div className="grid grid-cols-[200px_1fr] gap-4">
                <span className="text-gray-700 font-medium">Руководитель</span>
                <span className="text-black">Григорян Армен Михайлович</span>
              </div>
              <div className="grid grid-cols-[200px_1fr] gap-4">
                <span className="text-gray-700 font-medium">Почта</span>
                <span className="text-black">pr-service@svobodako.ru</span>
              </div>
              <div className="grid grid-cols-[200px_1fr] gap-4">
                <span className="text-gray-700 font-medium">Сайт</span>
                <span className="text-black">
                  http://www.svobodako.ru/start2.aspx?s=0&p=312
                </span>
              </div>
              <div className="grid grid-cols-[200px_1fr] gap-4">
                <span className="text-gray-700 font-medium">
                  Подотрасль (основная)
                </span>
                <span className="text-black">Косметика</span>
              </div>
              <div className="grid grid-cols-[200px_1fr] gap-4">
                <span className="text-gray-700 font-medium">
                  Основная отрасль
                </span>
                <span className="text-black">Химическая промышленность</span>
              </div>
              <div className="grid grid-cols-[200px_1fr] gap-4">
                <span className="text-gray-700 font-medium">
                  Контакт руководства
                </span>
                <span className="text-black">+ 7 956 456 45 67</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md">
              Финансы
            </button>
            <button className="bg-gray-200 text-black px-6 py-2 rounded-md hover:bg-gray-300">
              Налоги
            </button>
            <button className="bg-gray-200 text-black px-6 py-2 rounded-md hover:bg-gray-300">
              Инвестиции и экспорт
            </button>
            <button className="bg-gray-200 text-black px-6 py-2 rounded-md hover:bg-gray-300">
              ЗУ
            </button>
            <button className="bg-gray-200 text-black px-6 py-2 rounded-md hover:bg-gray-300">
              ОКСы
            </button>
            <button className="bg-gray-200 text-black px-6 py-2 rounded-md hover:bg-gray-300">
              Прочее
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  Выручка предприятия, тыс. руб
                </h3>
                <select className="text-sm border rounded px-2 py-1">
                  <option>2025</option>
                </select>
              </div>
              <div className="relative flex items-center justify-center h-32 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name: "2025",
                          value: 453,
                          fill: "url(#blueGradient)",
                        },
                        {
                          name: "2024",
                          value: 200,
                          fill: "url(#pinkGradient)",
                        },
                        {
                          name: "2023",
                          value: 187,
                          fill: "url(#lightPinkGradient)",
                        },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      dataKey="value"
                      stroke="none"
                    >
                      <defs>
                        <linearGradient
                          id="blueGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#4285f4" />
                          <stop offset="100%" stopColor="#1a73e8" />
                        </linearGradient>
                        <linearGradient
                          id="pinkGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#f8bbd9" />
                          <stop offset="100%" stopColor="#e91e63" />
                        </linearGradient>
                        <linearGradient
                          id="lightPinkGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#fce4ec" />
                          <stop offset="100%" stopColor="#f48fb1" />
                        </linearGradient>
                      </defs>
                      {[
                        {
                          name: "2025",
                          value: 453,
                          fill: "url(#blueGradient)",
                        },
                        {
                          name: "2024",
                          value: 200,
                          fill: "url(#pinkGradient)",
                        },
                        {
                          name: "2023",
                          value: 187,
                          fill: "url(#lightPinkGradient)",
                        },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-2 left-8 text-xs text-gray-500">
                  2025
                </div>
                <div className="absolute bottom-2 left-2 text-xs text-gray-500">
                  2024
                </div>
                <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                  2023
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">453 тыс.руб</div>
                <div className="text-sm text-gray-500 flex items-center justify-center gap-1">
                  <TrendingUp className="h-4 w-4" />+ 2,4 % vs 2024
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  Чистая прибыль (убыток)
                </h3>
                <select className="text-sm border rounded px-2 py-1">
                  <option>2025</option>
                </select>
              </div>
              <div className="h-32 mb-4 flex items-end justify-center">
                <div className="flex items-end gap-1">
                  <div className="w-8 h-16 bg-blue-500 rounded-t"></div>
                  <div className="w-8 h-20 bg-blue-600 rounded-t"></div>
                  <div className="w-8 h-12 bg-blue-400 rounded-t"></div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">345 тыс.руб</div>
                <div className="text-sm text-gray-500">- 3,4 % vs 2024</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  Средняя заработная плата
                </h3>
                <select className="text-sm border rounded px-2 py-1">
                  <option>2023</option>
                </select>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Все сотрудников организации</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">95 тыс.руб</div>
                  <div className="text-sm text-gray-500">+ 15,4 % vs 2024</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                    <span className="text-sm">
                      Сотрудники, работающие в Москве
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">70 тыс.руб</div>
                  <div className="text-sm text-gray-500">+ 15,4 % vs 2024</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  Среднесписочная численность персонала (всего по компании)
                </h3>
                <select className="text-sm border rounded px-2 py-1">
                  <option>2025</option>
                </select>
              </div>
              <div className="h-32 mb-4 flex items-end">
                <div className="w-full h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded"></div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">500 чел</div>
                <div className="text-sm text-gray-500">+ 13,4 % vs 2024</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  Фонд оплаты всех сотрудников организации
                </h3>
                <select className="text-sm border rounded px-2 py-1">
                  <option>2024</option>
                </select>
              </div>
              <div className="h-32 mb-4 flex items-end justify-center gap-2">
                <div className="w-8 h-20 bg-blue-500 rounded-t"></div>
                <div className="w-8 h-24 bg-blue-600 rounded-t"></div>
                <div className="w-8 h-16 bg-blue-400 rounded-t"></div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">453 тыс.руб</div>
                <div className="text-sm text-gray-500">+ 1,4 % vs 2023</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6">
              <div className="h-48 flex items-end justify-center">
                <div className="flex items-end gap-4">
                  <div className="text-center">
                    <div className="w-12 h-20 bg-pink-400 rounded-t mb-2"></div>
                    <div className="text-xs">2022</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-32 bg-pink-500 rounded-t mb-2"></div>
                    <div className="text-xs">2024</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-40 bg-blue-500 rounded-t mb-2"></div>
                    <div className="text-xs">2025</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const CompanyDataPage = () => (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 bg-gray-200 min-h-screen">
        <div className="p-4">
          <div className="bg-white p-4 rounded-lg mb-8">
            <div className="flex items-center gap-6">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 border-2 border-gray-400 w-8 h-8 top-1 left-0"></div>
                <div className="absolute inset-0 bg-gray-800 w-8 h-8 transform rotate-45 top-1 left-0">
                  <div className="absolute inset-2 border border-white"></div>
                </div>
              </div>
              <div>
                <div className="text-base font-bold text-black">
                  ИНДУСТИАЛЬНЫЕ
                </div>
                <div className="text-sm text-gray-600">данные Москвы</div>
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            <div
              className="px-3 py-3 rounded flex items-center gap-3 text-gray-600 hover:bg-gray-300 cursor-pointer"
              onClick={() => setCurrentPage("dashboard")}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              <span className="text-base">Дашборд</span>
            </div>
            <div className="bg-gray-300 px-3 py-3 rounded flex items-center gap-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-base">Данные о компаниях</span>
            </div>
            <div className="px-3 py-3 rounded flex items-center gap-3 text-gray-600 hover:bg-gray-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 17v-2.25A2.25 2.25 0 0011.25 12h2.5A2.25 2.25 0 0016 14.25V17M9 17H7a2 2 0 01-2-2v-6a2 2 0 012-2h10a2 2 0 012 2v6a2 2 0 01-2 2h-2M9 17v-10" />
              </svg>
              <span className="text-base">Отчеты</span>
            </div>
            <div className="px-3 py-3 rounded flex items-center gap-3 text-gray-600 hover:bg-gray-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-base">Настройки</span>
            </div>
            <div className="px-3 py-3 rounded flex items-center gap-3 text-gray-600 hover:bg-gray-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-base">Помощь</span>
            </div>
          </nav>
        </div>
      </div>

      <div className="flex-1">
        <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-black">Данные о компаниях</h1>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300">
              <img
                src="/profile-avatar.jpg"
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <div
                className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center"
                style={{ display: "none" }}
              >
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <div className="relative">
              <div className="w-10 h-10 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">3</span>
              </div>
            </div>

            <div className="w-10 h-10 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Введите ИНН компании"
                  value={searchINN}
                  onChange={(e) => setSearchINN(e.target.value)}
                  className="bg-gray-200 text-black px-4 py-2 rounded-md placeholder-gray-500 w-80"
                />
              </div>
              <button className="bg-white border border-gray-300 text-black px-6 py-2 rounded-md flex items-center gap-2 hover:bg-gray-50">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
                Поиск
              </button>
            </div>
            <button className="bg-white border border-gray-300 text-black px-6 py-2 rounded-md flex items-center gap-2 hover:bg-gray-50">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Добавить компанию
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden mt-4">
            <table className="w-full table-fixed">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="w-32 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ИНН
                  </th>
                  <th className="w-48 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Полное наименование
                  </th>
                  <th className="w-24 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="w-40 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Адрес производства
                  </th>
                  <th className="w-40 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Юридический адрес
                  </th>
                  <th className="w-32 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Отрасль
                  </th>
                  <th className="w-28 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата регистрации
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCompanies.map((company, index) => (
                  <tr
                    key={company.inn}
                    className={index % 2 === 1 ? "bg-gray-50" : ""}
                  >
                    <td className="px-3 py-4 truncate text-sm text-gray-900">
                      {company.inn}
                    </td>
                    <td
                      className="px-3 py-4 truncate text-sm text-blue-600 underline cursor-pointer hover:text-blue-800"
                      onClick={() => {
                        setSelectedCompany(company);
                        setCurrentPage("companydetail");
                      }}
                    >
                      {company.name}
                    </td>
                    <td className="px-3 py-4 truncate text-sm text-gray-900">
                      {company.status}
                    </td>
                    <td className="px-3 py-4 truncate text-sm text-gray-900">
                      {company.productionAddress}
                    </td>
                    <td className="px-3 py-4 truncate text-sm text-gray-900">
                      {company.legalAddress}
                    </td>
                    <td className="px-3 py-4 truncate text-sm text-gray-900">
                      {company.industry}
                    </td>
                    <td className="px-3 py-4 truncate text-sm text-gray-900">
                      {company.registrationDate}
                    </td>
                  </tr>
                ))}
                {filteredCompanies.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-3 py-8 text-center text-sm text-gray-500"
                    >
                      Компании с указанным ИНН не найдены
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {!searchINN && (
            <div className="flex justify-center mt-6">
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 bg-gray-300 text-black rounded">
                  1
                </button>
                <button className="px-3 py-1 bg-white border border-gray-300 text-black rounded hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-1 bg-white border border-gray-300 text-black rounded hover:bg-gray-50">
                  3
                </button>
                <button className="px-3 py-1 bg-white border border-gray-300 text-black rounded hover:bg-gray-50">
                  4
                </button>
                <span className="px-2">...</span>
                <button className="px-3 py-1 bg-white border border-gray-300 text-black rounded hover:bg-gray-50">
                  9
                </button>
                <button className="px-3 py-1 bg-white border border-gray-300 text-black rounded hover:bg-gray-50">
                  10
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const DashboardPage = () => (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 bg-gray-200 min-h-screen">
        <div className="p-4">
          <div className="bg-white p-4 rounded-lg mb-8">
            <div className="flex items-center gap-6">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 border-2 border-gray-400 w-8 h-8 top-1 left-0"></div>
                <div className="absolute inset-0 bg-gray-800 w-8 h-8 transform rotate-45 top-1 left-0">
                  <div className="absolute inset-2 border border-white"></div>
                </div>
              </div>
              <div>
                <div className="text-base font-bold text-black">
                  ИНДУСТИАЛЬНЫЕ
                </div>
                <div className="text-sm text-gray-600">данные Москвы</div>
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            <div className="bg-gray-300 px-3 py-3 rounded flex items-center gap-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              <span className="text-base">Дашборд</span>
            </div>
            <div
              className="px-3 py-3 rounded flex items-center gap-3 text-gray-600 hover:bg-gray-300 cursor-pointer"
              onClick={() => setCurrentPage("companydata")}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-base">Данные о компаниях</span>
            </div>
            <div className="px-3 py-3 rounded flex items-center gap-3 text-gray-600 hover:bg-gray-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 17v-2.25A2.25 2.25 0 0011.25 12h2.5A2.25 2.25 0 0016 14.25V17M9 17H7a2 2 0 01-2-2v-6a2 2 0 012-2h10a2 2 0 012 2v6a2 2 0 01-2 2h-2M9 17v-10" />
              </svg>
              <span className="text-base">Отчеты</span>
            </div>
            <div className="px-3 py-3 rounded flex items-center gap-3 text-gray-600 hover:bg-gray-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-base">Настройки</span>
            </div>
            <div className="px-3 py-3 rounded flex items-center gap-3 text-gray-600 hover:bg-gray-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-base">Помощь</span>
            </div>
          </nav>
        </div>
      </div>

      <div className="flex-1">
        <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-black">Дашборд</h1>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300">
              <img
                src="/profile-avatar.jpg"
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <div
                className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center"
                style={{ display: "none" }}
              >
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <div className="relative">
              <div className="w-10 h-10 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">3</span>
              </div>
            </div>

            <div className="w-10 h-10 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4">
              <div className="relative">
                <select className="bg-white border border-gray-300 text-black px-4 py-2 rounded-md appearance-none cursor-pointer pr-8">
                  <option>Выберите отрасль</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-black"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-md">
                <span className="text-sm">
                  {formatDateRange(startDate, endDate).days} дней
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="text-sm text-gray-500 bg-transparent border-none outline-none cursor-pointer"
                  />
                  <span className="text-sm text-gray-500">-</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="text-sm text-gray-500 bg-transparent border-none outline-none cursor-pointer"
                  />
                </div>
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <div className="relative">
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                id="pdf-upload"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    console.log("PDF file selected:", file.name);
                    // Handle PDF file upload here
                  }
                }}
              />
              <label
                htmlFor="pdf-upload"
                className="bg-black text-white px-7 py-3 rounded-full text-sm flex items-center gap-2 hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Сформировать отчет
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-300 h-48 rounded-lg"></div>
                <div className="bg-gray-300 h-48 rounded-lg"></div>
                <div className="bg-gray-300 h-48 rounded-lg"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-300 h-48 rounded-lg"></div>
                <div className="bg-gray-300 h-48 rounded-lg"></div>
                <div className="bg-gray-300 h-48 rounded-lg"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-300 h-64 rounded-lg"></div>

                <div className="bg-gray-300 h-64 rounded-lg"></div>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gray-400 p-6 rounded-lg"></div>
                <div className="bg-gray-400 p-6 rounded-lg"></div>
              </div>

              <div className="bg-gray-300 h-64 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (currentPage === "welcome") return <WelcomePage />;
  if (currentPage === "auth") return <AuthPage />;
  if (currentPage === "enterprise") return <EnterprisePage />;
  if (currentPage === "success") return <SuccessPage />;
  if (currentPage === "dashboard") return <DashboardPage />;
  if (currentPage === "companydata") return <CompanyDataPage />;
  if (currentPage === "companydetail" && selectedCompany)
    return <CompanyDetailPage company={selectedCompany} />;

  return <WelcomePage />;
}

export default App;
