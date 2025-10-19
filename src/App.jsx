import { useState, useEffect } from "react";
import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Cell,
  Legend,
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  Bar,
  BarChart,
  Rectangle,
  Tooltip,
} from "recharts";
import { TrendingUp } from "lucide-react";
import * as XLSX from "xlsx";

function App() {
  const [currentPage, setCurrentPage] = useState("welcome");
  const [selectedFormat, setSelectedFormat] = useState("api");
  const [searchINN, setSearchINN] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedIndustry] = useState("Выберите отрасль");

  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [uploadFormat, setUploadFormat] = useState("excel");
  const [companies, setCompanies] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null); // 'uploading', 'success', 'error'
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginCredentials, setLoginCredentials] = useState({
    username: "",
    password: "",
  });

  // Load companies when component mounts
  useEffect(() => {
    if (currentPage === "companydata") {
      fetchCompanies();
    }
  }, [currentPage]);

  // Load analytics data when dashboard is accessed
  useEffect(() => {
    if (currentPage === "dashboard") {
      fetchAnalyticsData();
    }
  }, [currentPage]);
  const [currentPageNum, setCurrentPageNum] = useState(1);

  useEffect(() => {
    if (currentPage === "success") {
      const timer = setTimeout(() => {
        setCurrentPage("welcome");
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [currentPage]);

  const fetchCompanies = async (page = 1, limit = 3) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/data/companies?page=${page}&limit=${limit}`
      );
      const data = await response.json();

      if (data.success) {
        setCompanies(data.data);
        setPagination(data.pagination);
        setCurrentPageNum(page);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalyticsData = async () => {
    setAnalyticsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3000/api/analytics/companies"
      );
      const data = await response.json();
      setAnalyticsData(data);
      console.log("Analytics data loaded:", data);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");

    // Simple hardcoded credentials
    const validUsername = "admin";
    const validPassword = "password123";

    if (
      loginCredentials.username === validUsername &&
      loginCredentials.password === validPassword
    ) {
      setIsAuthenticated(true);
      setCurrentPage("dashboard");
    } else {
      setLoginError("Неверный логин или пароль");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage("welcome");
    setLoginCredentials({ username: "", password: "" });
    setLoginError("");
  };

  // Excel file parsing function
  const parseExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: "binary" });

          // Get the first worksheet
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];

          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          if (jsonData.length < 2) {
            reject(
              new Error(
                "Excel file must have at least a header row and one data row"
              )
            );
            return;
          }

          // Get headers (first row)
          const headers = jsonData[0];

          // Convert data rows to objects
          const companies = jsonData
            .slice(1)
            .map((row, index) => {
              const company = {};
              headers.forEach((header, colIndex) => {
                if (header && row[colIndex] !== undefined) {
                  company[header] = row[colIndex];
                }
              });
              // Add row number if not present
              if (!company["№"]) {
                company["№"] = index + 1;
              }
              return company;
            })
            .filter((company) =>
              // Filter out empty rows
              Object.values(company).some(
                (value) => value !== null && value !== undefined && value !== ""
              )
            );

          resolve(companies);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsBinaryString(file);
    });
  };

  // Handle Excel file upload
  const handleExcelUpload = async (file) => {
    if (!file) return;

    setUploadStatus("uploading");
    setExcelFile(file);

    try {
      const parsedData = await parseExcelFile(file);
      setExcelData(parsedData);
      setUploadStatus("success");

      // Add parsed companies to the existing companies list
      // Always merge with existing companies, whether they're from API or static data
      const currentCompanies =
        companies.length > 0 ? companies : staticCompanies;

      // Update numbering for new companies to continue from existing companies
      const maxExistingNumber =
        currentCompanies.length > 0
          ? Math.max(...currentCompanies.map((c) => c["№"] || 0))
          : 0;

      const updatedParsedData = parsedData.map((company, index) => ({
        ...company,
        "№": maxExistingNumber + index + 1,
      }));

      const newCompanies = [...currentCompanies, ...updatedParsedData];
      setCompanies(newCompanies);

      console.log("Excel file parsed successfully:", parsedData);
      console.log("Total companies now:", newCompanies.length);
    } catch (error) {
      console.error("Error parsing Excel file:", error);
      setUploadStatus("error");
    }
  };

  useEffect(() => {
    if (currentPage === "companydata") {
      fetchCompanies(currentPageNum);
    }
  }, [currentPage, currentPageNum]);

  const handleSubmit = () => {
    if (selectedFormat === "excel" && excelData && excelData.length > 0) {
      // Excel data is already processed and added to companies
      setCurrentPage("companydata");
      setUploadStatus(null);
      setExcelData(null);
      setExcelFile(null);
    } else {
      setCurrentPage("success");
    }
  };

  const handleAuthRequest = () => {
    setCurrentPage("auth");
  };

  // Handle edit company
  const handleEditCompany = (company) => {
    setEditingCompany(company);
    setShowEditModal(true);
  };

  // Handle delete company
  const handleDeleteCompany = (company) => {
    setEditingCompany(company);
    setShowDeleteModal(true);
  };

  // Confirm delete company
  const confirmDeleteCompany = () => {
    if (editingCompany) {
      const updatedCompanies = companies.filter(
        (c) => c["№"] !== editingCompany["№"]
      );
      setCompanies(updatedCompanies);
      setShowDeleteModal(false);
      setEditingCompany(null);
      setCurrentPage("companydata"); // Go back to company list
    }
  };

  // Save edited company
  const saveEditedCompany = (updatedCompany) => {
    const updatedCompanies = companies.map((c) =>
      c["№"] === updatedCompany["№"] ? updatedCompany : c
    );
    setCompanies(updatedCompanies);
    setShowEditModal(false);
    setEditingCompany(null);
  };

  // Static company data as fallback
  const staticCompanies = [
    {
      "№": 1,
      ИНН: "781633333333",
      "Наименование организации": 'ООО "САГА"',
      "Полное наименование организации":
        'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ "САГА"',
      "Юридический адрес":
        "119261, г. Москва, вн.тер.г. муниципальный округ Гагаринский, ул Вавилова, д. 72/13, помещ. 1/Ц",
      "Основная отрасль": "Торговля оптовая неспециализированная",
      "Дата регистрации": 39574,
      Руководство: "Блинов Леонид Сергеевич",
      "Контактные данные руководителя": "+7 (499) 2428837",
      Сайт: null,
      "Электронная почта": null,
      "Наличие особого статуса": null,
      "Выручка предприятия, тыс. руб. 2022": null,
      "Выручка предприятия, тыс. руб. 2023": 2457000,
      "Выручка предприятия, тыс. руб. 2024": 45688000,
      "Чистая прибыль (убыток),тыс. руб. 2022": -26000,
      "Чистая прибыль (убыток),тыс. руб. 2023": -278000,
      "Чистая прибыль (убыток),тыс. руб. 2024": 4477000,
      "Среднесписочная численность персонала (всего по компании), чел 2022":
        null,
      "Среднесписочная численность персонала (всего по компании), чел 2023":
        null,
      "Среднесписочная численность персонала (всего по компании), чел 2024": 3,
      "Фонд оплаты труда всех сотрудников организации, тыс. руб 2022": null,
      "Фонд оплаты труда всех сотрудников организации, тыс. руб 2023": null,
      "Фонд оплаты труда всех сотрудников организации, тыс. руб 2024": null,
      "Средняя з.п. всех сотрудников организации,  тыс.руб. 2022": null,
      "Средняя з.п. всех сотрудников организации,  тыс.руб. 2023": null,
      "Средняя з.п. всех сотрудников организации,  тыс.руб. 2024": null,
      "Налоги, уплаченные в бюджет Москвы (без акцизов), тыс.руб. 2022": null,
      "Налоги, уплаченные в бюджет Москвы (без акцизов), тыс.руб. 2023": null,
      "Налоги, уплаченные в бюджет Москвы (без акцизов), тыс.руб. 2024": 1553131,
      "Налог на прибыль, тыс.руб. 2022": null,
      "Налог на прибыль, тыс.руб. 2023": null,
      "Налог на прибыль, тыс.руб. 2024": 581832,
      "Налог на имущество, тыс.руб. 2022": null,
      "Налог на имущество, тыс.руб. 2023": null,
      "Налог на имущество, тыс.руб. 2024": null,
      "Налог на землю, тыс.руб. 2022": null,
      "Налог на землю, тыс.руб. 2023": null,
      "Налог на землю, тыс.руб. 2024": null,
      "Прочие налоги 2022": null,
      "Прочие налоги 2023": null,
      "Прочие налоги 2024": 569322,
    },
    {
      "№": 2,
      ИНН: "7714877618",
      "Наименование организации": 'ООО "КОЛОРИТ"',
      "Полное наименование организации":
        'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ "КОЛОРИТ"',
      "Юридический адрес":
        '111024, г. Москва, вн.тер.г. муниципальный округ Лефортово, ул Авиамоторная, д. 50, стр. 2, помещ. 48/2 (Офисный центр "Авиамоторная 50")',
      "Основная отрасль":
        "Деятельность ресторанов и услуги по доставке продуктов питания",
      "Дата регистрации": 41095,
      Руководство: "Дубровина Екатерина Александровна",
      "Контактные данные руководителя": "+7 (495) 5067738",
      Сайт: null,
      "Электронная почта": null,
      "Наличие особого статуса": null,
      "Выручка предприятия, тыс. руб. 2022": null,
      "Выручка предприятия, тыс. руб. 2023": null,
      "Выручка предприятия, тыс. руб. 2024": null,
      "Чистая прибыль (убыток),тыс. руб. 2022": -10000,
      "Чистая прибыль (убыток),тыс. руб. 2023": null,
      "Чистая прибыль (убыток),тыс. руб. 2024": null,
      "Среднесписочная численность персонала (всего по компании), чел 2022":
        null,
      "Среднесписочная численность персонала (всего по компании), чел 2023": 1,
      "Среднесписочная численность персонала (всего по компании), чел 2024": 1,
      "Фонд оплаты труда всех сотрудников организации, тыс. руб 2022": null,
      "Фонд оплаты труда всех сотрудников организации, тыс. руб 2023": null,
      "Фонд оплаты труда всех сотрудников организации, тыс. руб 2024": null,
      "Средняя з.п. всех сотрудников организации,  тыс.руб. 2022": null,
      "Средняя з.п. всех сотрудников организации,  тыс.руб. 2023": null,
      "Средняя з.п. всех сотрудников организации,  тыс.руб. 2024": null,
      "Налоги, уплаченные в бюджет Москвы (без акцизов), тыс.руб. 2022": null,
      "Налоги, уплаченные в бюджет Москвы (без акцизов), тыс.руб. 2023": 7807,
      "Налоги, уплаченные в бюджет Москвы (без акцизов), тыс.руб. 2024": 600,
      "Налог на прибыль, тыс.руб. 2022": null,
      "Налог на прибыль, тыс.руб. 2023": null,
      "Налог на прибыль, тыс.руб. 2024": null,
      "Налог на имущество, тыс.руб. 2022": null,
      "Налог на имущество, тыс.руб. 2023": null,
      "Налог на имущество, тыс.руб. 2024": null,
      "Налог на землю, тыс.руб. 2022": null,
      "Налог на землю, тыс.руб. 2023": null,
      "Налог на землю, тыс.руб. 2024": null,
      "Прочие налоги 2022": null,
      "Прочие налоги 2023": null,
      "Прочие налоги 2024": null,
    },
    {
      "№": 3,
      ИНН: "7719471121",
      "Наименование организации": 'ООО "ФИОЛЕНТ"',
      "Полное наименование организации":
        'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ "ФИОЛЕНТ"',
      "Юридический адрес":
        "105122, г. Москва, бульвар Сиреневый, д. 3 к. 3 этаж пом. ком. 1 ,II , 1-25",
      "Основная отрасль": "Стоматологическая практика",
      "Дата регистрации": 42955,
      Руководство: "Подвысоцкий Владимир Антонович",
      "Контактные данные руководителя": "+7 (966) 3577353",
      Сайт: null,
      "Электронная почта": "irina1401@list.ru",
      "Наличие особого статуса": "УСН",
      "Выручка предприятия, тыс. руб. 2022": null,
      "Выручка предприятия, тыс. руб. 2023": null,
      "Выручка предприятия, тыс. руб. 2024": null,
      "Чистая прибыль (убыток),тыс. руб. 2022": -279000,
      "Чистая прибыль (убыток),тыс. руб. 2023": -310000,
      "Чистая прибыль (убыток),тыс. руб. 2024": -307000,
      "Среднесписочная численность персонала (всего по компании), чел 2022": 2,
      "Среднесписочная численность персонала (всего по компании), чел 2023": 2,
      "Среднесписочная численность персонала (всего по компании), чел 2024": 2,
      "Фонд оплаты труда всех сотрудников организации, тыс. руб 2022": null,
      "Фонд оплаты труда всех сотрудников организации, тыс. руб 2023": null,
      "Фонд оплаты труда всех сотрудников организации, тыс. руб 2024": null,
      "Средняя з.п. всех сотрудников организации,  тыс.руб. 2022": null,
      "Средняя з.п. всех сотрудников организации,  тыс.руб. 2023": null,
      "Средняя з.п. всех сотрудников организации,  тыс.руб. 2024": null,
      "Налоги, уплаченные в бюджет Москвы (без акцизов), тыс.руб. 2022": null,
      "Налоги, уплаченные в бюджет Москвы (без акцизов), тыс.руб. 2023": 1,
      "Налоги, уплаченные в бюджет Москвы (без акцизов), тыс.руб. 2024": null,
      "Налог на прибыль, тыс.руб. 2022": null,
      "Налог на прибыль, тыс.руб. 2023": null,
      "Налог на прибыль, тыс.руб. 2024": null,
      "Налог на имущество, тыс.руб. 2022": null,
      "Налог на имущество, тыс.руб. 2023": null,
      "Налог на имущество, тыс.руб. 2024": null,
      "Налог на землю, тыс.руб. 2022": null,
      "Налог на землю, тыс.руб. 2023": null,
      "Налог на землю, тыс.руб. 2024": null,
      "Прочие налоги 2022": null,
      "Прочие налоги 2023": null,
      "Прочие налоги 2024": null,
    },
  ];

  // Use companies from state (which includes both API data and uploaded Excel data)
  // If no companies in state, fall back to static data
  const displayCompanies = companies.length > 0 ? companies : staticCompanies;

  const filteredCompanies = displayCompanies.filter(
    (company) => company.ИНН && company.ИНН.includes(searchINN)
  );

  const WelcomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center px-4">
      {/* Header with Logo */}
      <div className="flex items-center gap-8 mb-16">
        <div className="relative w-20 h-20 flex-shrink-0">
          <div className="absolute inset-0 border-2 border-gray-400 w-16 h-16 top-2 left-2"></div>
          <div className="absolute inset-0 bg-gray-800 w-16 h-16 transform rotate-45 top-2 left-2">
            <div className="absolute inset-3 border border-white"></div>
          </div>
        </div>
        <div className="text-left flex-1">
          <h1 className="text-3xl font-bold text-black">ИНДУСТРИАЛЬНЫЕ</h1>
          <p className="text-xl text-gray-600">данные Москвы</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="text-center mb-20 max-w-4xl">
        <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
          Добро пожаловать
        </h2>
        <h3 className="text-3xl md:text-4xl font-semibold text-gray-600 mb-8">
          в Индустриальные данные Москвы
        </h3>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-6">
        <button
          onClick={() => handleAuthRequest("dashboard")}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-10 py-4 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          Сотруднику ДИПП
        </button>
        <button
          onClick={() => handleAuthRequest("enterprise")}
          className="bg-white text-gray-700 border-2 border-gray-300 px-10 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          Партнерам
        </button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-indigo-200 rounded-full opacity-20 blur-xl"></div>
    </div>
  );

  const AuthPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center px-4">
      <div className="flex items-center gap-8 mb-16">
        <div className="relative w-20 h-20 flex-shrink-0">
          <div className="absolute inset-0 border-2 border-gray-400 w-16 h-16 top-2 left-2"></div>
          <div className="absolute inset-0 bg-gray-800 w-16 h-16 transform rotate-45 top-2 left-2">
            <div className="absolute inset-3 border border-white"></div>
          </div>
        </div>
        <div className="text-left flex-1">
          <h1 className="text-3xl font-bold text-black">ИНДУСТРИАЛЬНЫЕ</h1>
          <p className="text-xl text-gray-600">данные Москвы</p>
        </div>
      </div>

      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold text-black text-center mb-12">
          Авторизация
        </h2>

        <form onSubmit={handleLogin}>
          <div className="space-y-4 mb-8">
            <input
              type="text"
              placeholder="Логин"
              value={loginCredentials.username}
              onChange={(e) =>
                setLoginCredentials((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
              className="w-full bg-gray-200 text-gray-700 px-6 py-4 rounded-full placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
            <input
              type="password"
              placeholder="Пароль"
              value={loginCredentials.password}
              onChange={(e) =>
                setLoginCredentials((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              className="w-full bg-gray-200 text-gray-700 px-6 py-4 rounded-full placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
              {loginError}
            </div>
          )}

          <div className="flex flex-col items-center gap-4">
            <button
              type="submit"
              className="bg-black text-white px-12 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
              Войти
            </button>
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Забыли пароль?
            </button>
          </div>
        </form>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 text-center">
            <strong>Тестовые данные для входа:</strong>
            <br />
            Логин: <code>admin</code>
            <br />
            Пароль: <code>password123</code>
          </p>
        </div>
      </div>
    </div>
  );

  const EnterprisePage = () => (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-black text-center mb-12">
          Индустриальные данные Москвы
        </h1>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-black mb-6">
              Введите данные предприятия
            </h2>

            <div className="mb-4">
              <div className="relative">
                <select className="w-full bg-gray-200 text-black px-4 py-3 rounded-md appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">выберите отрасль</option>
                  <option value="станкостроительная">
                    станкостроительная отрасль
                  </option>
                  <option value="инструментальная">
                    инструментальная отрасль
                  </option>
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
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      handleExcelUpload(file);
                    }
                  }}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="w-full bg-gray-200 px-4 py-8 rounded-md border-2 border-dashed border-gray-400 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
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
                    {uploadStatus === "uploading"
                      ? "Обработка файла..."
                      : uploadStatus === "success"
                      ? "Файл успешно загружен!"
                      : uploadStatus === "error"
                      ? "Ошибка при загрузке файла"
                      : "прикрепите файл"}
                  </span>
                </label>

                {/* Show parsed data preview */}
                {excelData && excelData.length > 0 && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800 font-medium mb-2">
                      Найдено компаний: {excelData.length}
                    </p>
                    <div className="text-xs text-green-700">
                      <p>
                        Первая компания:{" "}
                        {excelData[0]["Наименование организации"] ||
                          "Не указано"}
                      </p>
                      <p>ИНН: {excelData[0]["ИНН"] || "Не указан"}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-center pt-8">
            <button
              onClick={handleSubmit}
              disabled={
                selectedFormat === "excel" &&
                (!excelData || excelData.length === 0)
              }
              className={`px-12 py-3 rounded-md font-medium transition-colors ${
                selectedFormat === "excel" &&
                (!excelData || excelData.length === 0)
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
            >
              {selectedFormat === "excel" && excelData && excelData.length > 0
                ? `Добавить ${excelData.length} компаний`
                : "Отправить"}
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
          Индустриальные данные Москвы
        </h1>

        <div className="bg-gray-300 rounded-lg p-16 text-center">
          <h2 className="text-4xl font-bold text-black mb-6">Спасибо!</h2>
          <p className="text-2xl text-black">Данные загружены успешно</p>
        </div>
      </div>
    </div>
  );

  const CompanyDetailPage = ({ company }) => (
    <div className="bg-gray-50 flex min-h-screen">
      <div className="w-64 bg-gray-200">
        <div className="p-4">
          <div className="bg-white p-4 rounded-lg mb-8">
            <div className="flex items-center gap-8">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 border-2 border-gray-400 w-8 h-8 top-1 left-0"></div>
                <div className="absolute inset-0 bg-gray-800 w-8 h-8 transform rotate-45 top-1 left-0">
                  <div className="absolute inset-2 border border-white"></div>
                </div>
              </div>
              <div>
                <div className="text-base font-bold text-black">
                  ИНДУСТРИАЛЬНЫЕ
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
            <div className="bg-blue-600 text-white px-3 py-3 rounded flex items-center gap-3">
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

        <div className="p-4 pb-2">
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
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              ← Назад к списку
            </button>
          </div>

          {/* Edit and Delete Buttons */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => handleEditCompany(company)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Редактировать данные
            </button>
            <button
              onClick={() => handleDeleteCompany(company)}
              className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM8 8a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm-3 3a1 1 0 011-1h6a1 1 0 110 2H6a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Удалить компанию
            </button>
          </div>

          <div className="bg-white rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-black mb-4">
              {company["Наименование организации"]}
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-[200px_1fr] gap-4">
                <span className="text-gray-700 font-medium">
                  Полное наименование
                </span>
                <span className="text-black">
                  {company["Полное наименование организации"]}
                </span>
              </div>
              <div className="grid grid-cols-[200px_1fr] gap-4">
                <span className="text-gray-700 font-medium">
                  Дата регистрации
                </span>
                <span className="text-black">
                  {company["Дата регистрации"]
                    ? new Date(
                        (company["Дата регистрации"] - 25569) * 86400 * 1000
                      ).toLocaleDateString("ru-RU")
                    : "Не указана"}
                </span>
              </div>
              <div className="grid grid-cols-[200px_1fr] gap-4">
                <span className="text-gray-700 font-medium">Руководитель</span>
                <span className="text-black">
                  {company["Руководство"] || "Не указан"}
                </span>
              </div>
              <div className="grid grid-cols-[200px_1fr] gap-4">
                <span className="text-gray-700 font-medium">Почта</span>
                <span className="text-black">
                  {company["Электронная почта"] || "Не указана"}
                </span>
              </div>
              <div className="grid grid-cols-[200px_1fr] gap-4">
                <span className="text-gray-700 font-medium">Сайт</span>
                <span className="text-black">
                  {company["Сайт"] || "Не указан"}
                </span>
              </div>
              <div className="grid grid-cols-[200px_1fr] gap-4">
                <span className="text-gray-700 font-medium">Особый статус</span>
                <span className="text-black">
                  {company["Наличие особого статуса"] || "Не указан"}
                </span>
              </div>
              <div className="grid grid-cols-[200px_1fr] gap-4">
                <span className="text-gray-700 font-medium">
                  Основная отрасль
                </span>
                <span className="text-black">
                  {company["Основная отрасль"] || "Не указана"}
                </span>
              </div>
              <div className="grid grid-cols-[200px_1fr] gap-4">
                <span className="text-gray-700 font-medium">
                  Контакт руководства
                </span>
                <span className="text-black">
                  {company["Контактные данные руководителя"] || "Не указан"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex mb-6 bg-white border border-gray-200 rounded-lg overflow-hidden">
            <button className="bg-blue-600 text-white px-4 py-3 text-sm font-medium hover:bg-blue-700 transition-colors flex-1">
              Финансы
            </button>
            <button className="bg-white text-gray-700 px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-colors flex-1 border-l border-gray-200">
              Налоги
            </button>
            <button className="bg-white text-gray-700 px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-colors flex-1 border-l border-gray-200">
              Инвестиции и экспорт
            </button>
            <button className="bg-white text-gray-700 px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-colors flex-1 border-l border-gray-200">
              ЗУ
            </button>
            <button className="bg-white text-gray-700 px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-colors flex-1 border-l border-gray-200">
              ОКСы
            </button>
            <button className="bg-white text-gray-700 px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-colors flex-1 border-l border-gray-200">
              Прочее
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-4 mt-12">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Выручка предприятия, тыс. руб
                </h3>
                <select className="text-sm border border-gray-200 rounded-md px-3 py-2 bg-white text-gray-700 appearance-none cursor-pointer pr-8">
                  <option>2025</option>
                </select>
              </div>
              <div className="mb-4">
                <div className="h-40">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                    minWidth={250}
                    minHeight={150}
                  >
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: "2024",
                            value:
                              company["Выручка предприятия, тыс. руб. 2024"] ||
                              0,
                            fill: "url(#blueGradient)",
                          },
                          {
                            name: "2023",
                            value:
                              company["Выручка предприятия, тыс. руб. 2023"] ||
                              0,
                            fill: "url(#pinkGradient)",
                          },
                          {
                            name: "2022",
                            value:
                              company["Выручка предприятия, тыс. руб. 2022"] ||
                              0,
                            fill: "url(#lightPinkGradient)",
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={60}
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
                            name: "2024",
                            value:
                              company["Выручка предприятия, тыс. руб. 2024"] ||
                              0,
                            fill: "url(#blueGradient)",
                          },
                          {
                            name: "2023",
                            value:
                              company["Выручка предприятия, тыс. руб. 2023"] ||
                              0,
                            fill: "url(#pinkGradient)",
                          },
                          {
                            name: "2022",
                            value:
                              company["Выручка предприятия, тыс. руб. 2022"] ||
                              0,
                            fill: "url(#lightPinkGradient)",
                          },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {company["Выручка предприятия, тыс. руб. 2024"]
                      ? `${company["Выручка предприятия, тыс. руб. 2024"]} тыс.руб`
                      : "Нет данных"}
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 leading-none font-medium text-green-600">
                  {company["Выручка предприятия, тыс. руб. 2024"] &&
                  company["Выручка предприятия, тыс. руб. 2023"]
                    ? `+ ${(
                        ((company["Выручка предприятия, тыс. руб. 2024"] -
                          company["Выручка предприятия, тыс. руб. 2023"]) /
                          company["Выручка предприятия, тыс. руб. 2023"]) *
                        100
                      ).toFixed(1)} % vs 2023`
                    : "Нет данных для сравнения"}{" "}
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-gray-500 text-center leading-none text-xs">
                  Показатель выручки за последние 3 года
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Чистая прибыль (убыток)
                </h3>
                <select className="text-sm border border-gray-200 rounded-md px-3 py-2 bg-white text-gray-700 appearance-none cursor-pointer pr-8">
                  <option>2025</option>
                </select>
              </div>
              <div className="mb-4">
                <div className="h-48">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                    minWidth={250}
                    minHeight={150}
                  >
                    <AreaChart
                      data={[
                        {
                          year: "2022",
                          profit:
                            company["Чистая прибыль (убыток),тыс. руб. 2022"] ||
                            0,
                        },
                        {
                          year: "2023",
                          profit:
                            company["Чистая прибыль (убыток),тыс. руб. 2023"] ||
                            0,
                        },
                        {
                          year: "2024",
                          profit:
                            company["Чистая прибыль (убыток),тыс. руб. 2024"] ||
                            0,
                        },
                      ]}
                      margin={{
                        left: 20,
                        right: 20,
                        top: 10,
                        bottom: 10,
                      }}
                    >
                      <defs>
                        <linearGradient
                          id="profitGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3b82f6"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3b82f6"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="year"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                      />
                      <Area
                        dataKey="profit"
                        type="monotone"
                        fill="url(#profitGradient)"
                        fillOpacity={0.6}
                        stroke="#3b82f6"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {company["Чистая прибыль (убыток),тыс. руб. 2024"]
                      ? `${company["Чистая прибыль (убыток),тыс. руб. 2024"]} тыс.руб`
                      : "Нет данных"}
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 leading-none font-medium text-red-600">
                  {company["Чистая прибыль (убыток),тыс. руб. 2024"] &&
                  company["Чистая прибыль (убыток),тыс. руб. 2023"]
                    ? `${(
                        ((company["Чистая прибыль (убыток),тыс. руб. 2024"] -
                          company["Чистая прибыль (убыток),тыс. руб. 2023"]) /
                          Math.abs(
                            company["Чистая прибыль (убыток),тыс. руб. 2023"]
                          )) *
                        100
                      ).toFixed(1)} % vs 2023`
                    : "Нет данных для сравнения"}{" "}
                  <TrendingUp className="h-4 w-4 rotate-180" />
                </div>
                <div className="text-gray-500 text-center leading-none text-xs">
                  Показатель прибыли за последние 3 года
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Средняя заработная плата
                </h3>
                <select className="text-sm border border-gray-200 rounded-md px-3 py-2 bg-white text-gray-700 appearance-none cursor-pointer pr-8">
                  <option>2023</option>
                </select>
              </div>
              <div className="mb-4">
                <div className="h-40">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                    minWidth={250}
                    minHeight={150}
                  >
                    <BarChart
                      data={[
                        {
                          year: "2022",
                          allEmployees:
                            company[
                              "Среднесписочная численность персонала (всего по компании), чел 2022"
                            ] || 0,
                          moscowEmployees:
                            company[
                              "Среднесписочная численность персонала (всего по компании), чел 2022"
                            ] || 0,
                        },
                        {
                          year: "2023",
                          allEmployees:
                            company[
                              "Среднесписочная численность персонала (всего по компании), чел 2023"
                            ] || 0,
                          moscowEmployees:
                            company[
                              "Среднесписочная численность персонала (всего по компании), чел 2023"
                            ] || 0,
                        },
                        {
                          year: "2024",
                          allEmployees:
                            company[
                              "Среднесписочная численность персонала (всего по компании), чел 2024"
                            ] || 0,
                          moscowEmployees:
                            company[
                              "Среднесписочная численность персонала (всего по компании), чел 2024"
                            ] || 0,
                        },
                      ]}
                      margin={{
                        left: 12,
                        right: 12,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="year"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                      />
                      <Bar dataKey="allEmployees" fill="#3b82f6" radius={4} />
                      <Bar
                        dataKey="moscowEmployees"
                        fill="#ec4899"
                        radius={4}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      Все сотрудников организации
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">
                      {company[
                        "Средняя з.п. всех сотрудников организации,  тыс.руб. 2024"
                      ]
                        ? `${company["Средняя з.п. всех сотрудников организации,  тыс.руб. 2024"]} тыс.руб`
                        : "Нет данных"}
                    </div>
                    <div className="text-xs text-green-600">
                      {company[
                        "Средняя з.п. всех сотрудников организации,  тыс.руб. 2024"
                      ] &&
                      company[
                        "Средняя з.п. всех сотрудников организации,  тыс.руб. 2023"
                      ]
                        ? `+ ${(
                            ((company[
                              "Средняя з.п. всех сотрудников организации,  тыс.руб. 2024"
                            ] -
                              company[
                                "Средняя з.п. всех сотрудников организации,  тыс.руб. 2023"
                              ]) /
                              company[
                                "Средняя з.п. всех сотрудников организации,  тыс.руб. 2023"
                              ]) *
                            100
                          ).toFixed(1)} % vs 2023`
                        : "Нет данных для сравнения"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      Сотрудники, работающие в Москве
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">
                      {company[
                        "Средняя з.п. всех сотрудников организации,  тыс.руб. 2024"
                      ]
                        ? `${company["Средняя з.п. всех сотрудников организации,  тыс.руб. 2024"]} тыс.руб`
                        : "Нет данных"}
                    </div>
                    <div className="text-xs text-green-600">
                      {company[
                        "Средняя з.п. всех сотрудников организации,  тыс.руб. 2024"
                      ] &&
                      company[
                        "Средняя з.п. всех сотрудников организации,  тыс.руб. 2023"
                      ]
                        ? `+ ${(
                            ((company[
                              "Средняя з.п. всех сотрудников организации,  тыс.руб. 2024"
                            ] -
                              company[
                                "Средняя з.п. всех сотрудников организации,  тыс.руб. 2023"
                              ]) /
                              company[
                                "Средняя з.п. всех сотрудников организации,  тыс.руб. 2023"
                              ]) *
                            100
                          ).toFixed(1)} % vs 2023`
                        : "Нет данных для сравнения"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Среднесписочная численность персонала (всего по компании)
                </h3>

                <select className="text-sm border border-gray-200 rounded-md px-3 py-2 bg-white text-gray-700 appearance-none cursor-pointer pr-8">
                  <option>2025</option>
                </select>
              </div>
              <div className="mb-4">
                <div className="h-40">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                    minWidth={250}
                    minHeight={150}
                  >
                    <AreaChart
                      data={[
                        {
                          year: "2022",
                          headcount:
                            company[
                              "Среднесписочная численность персонала (всего по компании), чел 2022"
                            ] || 0,
                        },
                        {
                          year: "2023",
                          headcount:
                            company[
                              "Среднесписочная численность персонала (всего по компании), чел 2023"
                            ] || 0,
                        },
                        {
                          year: "2024",
                          headcount:
                            company[
                              "Среднесписочная численность персонала (всего по компании), чел 2024"
                            ] || 0,
                        },
                      ]}
                      margin={{
                        left: 20,
                        right: 20,
                        top: 10,
                        bottom: 10,
                      }}
                    >
                      <defs>
                        <linearGradient
                          id="headcountGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3b82f6"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3b82f6"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="year"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                      />
                      <Area
                        dataKey="headcount"
                        type="monotone"
                        fill="url(#headcountGradient)"
                        fillOpacity={0.6}
                        stroke="#3b82f6"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {company[
                      "Среднесписочная численность персонала (всего по компании), чел 2024"
                    ]
                      ? `${company["Среднесписочная численность персонала (всего по компании), чел 2024"]} чел`
                      : "Нет данных"}
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 leading-none font-medium text-green-600">
                  {company[
                    "Среднесписочная численность персонала (всего по компании), чел 2024"
                  ] &&
                  company[
                    "Среднесписочная численность персонала (всего по компании), чел 2023"
                  ]
                    ? `+ ${(
                        ((company[
                          "Среднесписочная численность персонала (всего по компании), чел 2024"
                        ] -
                          company[
                            "Среднесписочная численность персонала (всего по компании), чел 2023"
                          ]) /
                          company[
                            "Среднесписочная численность персонала (всего по компании), чел 2023"
                          ]) *
                        100
                      ).toFixed(1)} % vs 2023`
                    : "Нет данных для сравнения"}{" "}
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-gray-500 text-center leading-none text-xs">
                  Показатель численности за последние 3 года
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Фонд оплаты всех сотрудников организации
                </h3>
                <select className="text-sm border border-gray-200 rounded-md px-3 py-2 bg-white text-gray-700 appearance-none cursor-pointer pr-8">
                  <option>2024</option>
                </select>
              </div>
              <div className="mb-4">
                <div className="h-40">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                    minWidth={250}
                    minHeight={150}
                  >
                    <BarChart
                      data={[
                        {
                          year: "2022",
                          payroll:
                            company[
                              "Фонд оплаты труда всех сотрудников организации, тыс. руб 2022"
                            ] || 0,
                          fill: "#3b82f6",
                        },
                        {
                          year: "2023",
                          payroll:
                            company[
                              "Фонд оплаты труда всех сотрудников организации, тыс. руб 2023"
                            ] || 0,
                          fill: "#1d4ed8",
                        },
                        {
                          year: "2024",
                          payroll:
                            company[
                              "Фонд оплаты труда всех сотрудников организации, тыс. руб 2024"
                            ] || 0,
                          fill: "#1e40af",
                        },
                      ]}
                      margin={{
                        left: 12,
                        right: 12,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="year"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                      />
                      <Bar
                        dataKey="payroll"
                        strokeWidth={2}
                        radius={8}
                        activeIndex={2}
                        activeBar={({ ...props }) => {
                          return (
                            <Rectangle
                              {...props}
                              fillOpacity={0.8}
                              stroke={props.payload.fill}
                              strokeDasharray={4}
                              strokeDashoffset={4}
                            />
                          );
                        }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {company[
                      "Фонд оплаты труда всех сотрудников организации, тыс. руб 2024"
                    ]
                      ? `${company["Фонд оплаты труда всех сотрудников организации, тыс. руб 2024"]} тыс.руб`
                      : "Нет данных"}
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 leading-none font-medium text-green-600">
                  {company[
                    "Фонд оплаты труда всех сотрудников организации, тыс. руб 2024"
                  ] &&
                  company[
                    "Фонд оплаты труда всех сотрудников организации, тыс. руб 2023"
                  ]
                    ? `+ ${(
                        ((company[
                          "Фонд оплаты труда всех сотрудников организации, тыс. руб 2024"
                        ] -
                          company[
                            "Фонд оплаты труда всех сотрудников организации, тыс. руб 2023"
                          ]) /
                          company[
                            "Фонд оплаты труда всех сотрудников организации, тыс. руб 2023"
                          ]) *
                        100
                      ).toFixed(1)} % vs 2023`
                    : "Нет данных для сравнения"}{" "}
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-gray-500 text-center leading-none text-xs">
                  Показатель фонда оплаты за последние 3 года
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const CompanyDataPage = () => (
    <div className="bg-gray-50 flex min-h-screen">
      <div className="w-64 bg-gray-200">
        <div className="p-4">
          <div className="bg-white p-4 rounded-lg mb-8">
            <div className="flex items-center gap-8">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 border-2 border-gray-400 w-8 h-8 top-1 left-0"></div>
                <div className="absolute inset-0 bg-gray-800 w-8 h-8 transform rotate-45 top-1 left-0">
                  <div className="absolute inset-2 border border-white"></div>
                </div>
              </div>
              <div>
                <div className="text-base font-bold text-black">
                  ИНДУСТРИАЛЬНЫЕ
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
            <div className="bg-blue-600 text-white px-3 py-3 rounded flex items-center gap-3">
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
            <button
              onClick={() => setShowAddCompanyModal(true)}
              className="bg-white border border-gray-300 text-black px-6 py-2 rounded-md flex items-center gap-2 hover:bg-gray-50"
            >
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
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Загрузка данных...</span>
              </div>
            ) : (
              <table className="w-full table-fixed">
                <thead className="bg-blue-600">
                  <tr>
                    <th className="w-32 px-4 py-4 text-left text-sm font-medium text-white border-r border-blue-500">
                      ИНН
                    </th>
                    <th className="w-48 px-4 py-4 text-left text-sm font-medium text-white border-r border-blue-500">
                      Полное наименование
                    </th>
                    <th className="w-24 px-4 py-4 text-left text-sm font-medium text-white border-r border-blue-500">
                      Статус
                    </th>
                    <th className="w-40 px-4 py-4 text-left text-sm font-medium text-white border-r border-blue-500">
                      Адрес производства
                    </th>
                    <th className="w-40 px-4 py-4 text-left text-sm font-medium text-white border-r border-blue-500">
                      Юридический адрес
                    </th>
                    <th className="w-32 px-4 py-4 text-left text-sm font-medium text-white border-r border-blue-500">
                      Отрасль
                    </th>
                    <th className="w-28 px-4 py-4 text-left text-sm font-medium text-white">
                      Дата регистрации
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCompanies.map((company, index) => (
                    <tr
                      key={company.ИНН}
                      className={index % 2 === 1 ? "bg-gray-50" : ""}
                    >
                      <td className="px-3 py-4 truncate text-sm text-gray-900">
                        {company.ИНН}
                      </td>
                      <td
                        className="px-3 py-4 truncate text-sm text-blue-600 underline cursor-pointer hover:text-blue-800 bg-blue-50"
                        onClick={() => {
                          setSelectedCompany(company);
                          setCurrentPage("companydetail");
                        }}
                      >
                        {company["Наименование организации"]}
                      </td>
                      <td className="px-3 py-4 truncate text-sm text-gray-900">
                        {company["Наличие особого статуса"] || "Активна"}
                      </td>
                      <td className="px-3 py-4 truncate text-sm text-gray-900 bg-blue-50">
                        {company["Юридический адрес"]}
                      </td>
                      <td className="px-3 py-4 truncate text-sm text-gray-900">
                        {company["Юридический адрес"]}
                      </td>
                      <td className="px-3 py-4 truncate text-sm text-gray-900 bg-blue-50">
                        {company["Основная отрасль"]}
                      </td>
                      <td className="px-3 py-4 truncate text-sm text-gray-900">
                        {company["Дата регистрации"]
                          ? new Date(
                              (company["Дата регистрации"] - 25569) *
                                86400 *
                                1000
                            ).toLocaleDateString("ru-RU")
                          : "N/A"}
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
            )}
          </div>

          {/* Pagination Controls */}
          {!loading && !searchINN && (
            <div className="flex justify-between items-center mt-6 bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-700">
                Показано {companies.length} из {pagination.totalCount} компаний
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchCompanies(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Предыдущая
                </button>
                <span className="px-3 py-2 text-sm text-gray-700">
                  Страница {pagination.currentPage} из {pagination.totalPages}
                </span>
                <button
                  onClick={() => fetchCompanies(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Следующая
                </button>
              </div>
            </div>
          )}

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
      {showAddCompanyModal && <AddCompanyModal />}
    </div>
  );

  const DashboardPage = () => (
    <div className="bg-gray-50 flex min-h-screen">
      <div className="w-64 bg-gray-200">
        <div className="p-4">
          <div className="bg-white p-4 rounded-lg mb-8">
            <div className="flex items-center gap-8">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 border-2 border-gray-400 w-8 h-8 top-1 left-0"></div>
                <div className="absolute inset-0 bg-gray-800 w-8 h-8 transform rotate-45 top-1 left-0">
                  <div className="absolute inset-2 border border-white"></div>
                </div>
              </div>
              <div>
                <div className="text-base font-bold text-black">
                  ИНДУСТРИАЛЬНЫЕ
                </div>
                <div className="text-sm text-gray-600">данные Москвы</div>
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            <div className="bg-blue-600 text-white px-3 py-3 rounded flex items-center gap-3">
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
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Выйти
            </button>
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
                    d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z"
                    clipRule="evenodd"
                  />
                  <path d="M6 8h8v1H6V8zm0 2h8v1H6v-1zm0 2h5v1H6v-1z" />
                  <text
                    x="10"
                    y="13"
                    fontSize="3"
                    textAnchor="middle"
                    fill="currentColor"
                    fontWeight="bold"
                  >
                    PDF
                  </text>
                </svg>
                Сформировать отчет
              </label>
            </div>
          </div>

          {/* Dashboard Widgets */}
          {analyticsLoading && (
            <div className="flex justify-center items-center py-8">
              <div className="text-gray-600">
                Загрузка аналитических данных...
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Revenue Widget */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Выручка</h3>
                <span className="text-sm text-gray-500">2022-2024 гг.</span>
              </div>
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">
                  {analyticsData?.totalRevenue
                    ? `суммарно за периоды ${analyticsData.totalRevenue} тыс. руб`
                    : "суммарно за периоды 768 тыс. руб"}
                </div>
                <div className="h-32">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                    minWidth={250}
                    minHeight={150}
                  >
                    <AreaChart
                      data={
                        analyticsData?.revenueData || [
                          { year: "2022", revenue: 300 },
                          { year: "2023", revenue: 234 },
                          { year: "2024", revenue: 234 },
                        ]
                      }
                      margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                    >
                      <Tooltip
                        formatter={(value, name) => [`${value} тыс.руб`, name]}
                        labelFormatter={(label) => `${label} год`}
                        contentStyle={{
                          backgroundColor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <defs>
                        <linearGradient
                          id="revenueGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3b82f6"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3b82f6"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="year"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3b82f6"
                        fill="url(#revenueGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Net Profit Widget */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Чистая прибыль
                </h3>
                <span className="text-sm text-gray-500">2022-2024 гг.</span>
              </div>
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">
                  {analyticsData?.totalProfit
                    ? `суммарно за периоды ${analyticsData.totalProfit} млн. руб`
                    : "суммарно за периоды 10,42 млн. руб"}
                </div>
                <div className="h-32">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                    minWidth={250}
                    minHeight={150}
                  >
                    <AreaChart
                      data={
                        analyticsData?.profitData || [
                          { year: "2022", profit: 3.2 },
                          { year: "2023", profit: 5.1 },
                          { year: "2024", profit: 2.1 },
                        ]
                      }
                      margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                    >
                      <Tooltip
                        formatter={(value, name) => [`${value} млн.руб`, name]}
                        labelFormatter={(label) => `${label} год`}
                        contentStyle={{
                          backgroundColor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <defs>
                        <linearGradient
                          id="profitGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#ec4899"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#ec4899"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="year"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="profit"
                        stroke="#ec4899"
                        fill="url(#profitGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Total Employees Widget */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Общая численность сотрудников
                </h3>
                <span className="text-sm text-gray-500">2022-2024 гг.</span>
              </div>
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">
                  {analyticsData?.averageEmployees
                    ? `${analyticsData.averageEmployees} чел. среднее по годам`
                    : "300 чел. среднее по годам"}
                </div>
                <div className="h-32">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                    minWidth={250}
                    minHeight={150}
                  >
                    <BarChart
                      data={
                        analyticsData?.employeesData || [
                          { year: "2022", employees: 250 },
                          { year: "2023", employees: 300 },
                          { year: "2024", employees: 350 },
                        ]
                      }
                      margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                    >
                      <Tooltip
                        formatter={(value, name) => [`${value} чел.`, name]}
                        labelFormatter={(label) => `${label} год`}
                        contentStyle={{
                          backgroundColor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="year"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                      />
                      <Bar dataKey="employees" fill="#3b82f6" radius={4} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Top 10 Companies Widget */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Топ 10 компаний по выручке
                </h3>
                <span className="text-sm text-gray-500">2024</span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-900">
                    ООО "РУ КМЗ"
                  </span>
                  <span className="text-sm text-gray-600">356 млн. руб</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-900">
                    АО "ОМПК"
                  </span>
                  <span className="text-sm text-gray-600">346 млн. руб</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-900">
                    АО "ВБД"
                  </span>
                  <span className="text-sm text-gray-600">236 млн. руб</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-900">
                    АО "ГАЗПРОМНЕФТЬ - МНПЗ"
                  </span>
                  <span className="text-sm text-gray-600">146 млн. руб</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-900">
                    ООО "ДОБРОЛЕК"
                  </span>
                  <span className="text-sm text-gray-600">106 млн. руб</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-900">
                    ООО "Микрон"
                  </span>
                  <span className="text-sm text-gray-600">66 млн. руб</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-900">
                    АО "КОНДИТЕРСКИЙ КОНЦЕРН БАБАЕВСКИЙ"
                  </span>
                  <span className="text-sm text-gray-600">56 млн. руб</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-900">
                    ООО "НПП "ИТЭЛМА"
                  </span>
                  <span className="text-sm text-gray-600">47 млн. руб</span>
                </div>
              </div>
            </div>

            {/* Taxes Widget - Spans two columns */}
            <div className="md:col-span-2 bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Налоги</h3>
                <span className="text-sm text-gray-500">2022-2024 гг.</span>
              </div>
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-4">
                  общий размер налогов за весь период 245 тыс.руб
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-blue-600 text-white">
                        <th className="px-3 py-2 text-left border-r border-blue-500">
                          Наименование
                        </th>
                        <th className="px-3 py-2 text-left border-r border-blue-500">
                          2022
                        </th>
                        <th className="px-3 py-2 text-left border-r border-blue-500">
                          2023
                        </th>
                        <th className="px-3 py-2 text-left border-r border-blue-500">
                          2024
                        </th>
                        <th className="px-3 py-2 text-left">Доля 2024</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      <tr className="border-b border-gray-100">
                        <td className="px-3 py-2 text-gray-900">
                          Налоги в бюджет Москвы (без акцизов)
                        </td>
                        <td className="px-3 py-2 text-gray-900">
                          50 (+2.4% vs 2021)
                        </td>
                        <td className="px-3 py-2 text-gray-900">
                          75 (+2.4% vs 2022)
                        </td>
                        <td className="px-3 py-2 text-gray-900">
                          65 (-1.4% vs 2023)
                        </td>
                        <td className="px-3 py-2 text-gray-900">26%</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="px-3 py-2 text-gray-900">
                          Налог на прибыль
                        </td>
                        <td className="px-3 py-2 text-gray-900">
                          100 (+2.4% vs 2021)
                        </td>
                        <td className="px-3 py-2 text-gray-900">
                          297 (+2.4% vs 2022)
                        </td>
                        <td className="px-3 py-2 text-gray-900">
                          250 (-1.4% vs 2023)
                        </td>
                        <td className="px-3 py-2 text-gray-900">36%</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="px-3 py-2 text-gray-900">
                          Налог на имущество
                        </td>
                        <td className="px-3 py-2 text-gray-900">
                          30 (+2.4% vs 2021)
                        </td>
                        <td className="px-3 py-2 text-gray-900">
                          45 (+2.4% vs 2022)
                        </td>
                        <td className="px-3 py-2 text-gray-900">
                          40 (-1.4% vs 2023)
                        </td>
                        <td className="px-3 py-2 text-gray-900">16%</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="px-3 py-2 text-gray-900">
                          Земельный налог
                        </td>
                        <td className="px-3 py-2 text-gray-900">
                          20 (+2.4% vs 2021)
                        </td>
                        <td className="px-3 py-2 text-gray-900">
                          25 (+2.4% vs 2022)
                        </td>
                        <td className="px-3 py-2 text-gray-900">
                          22 (-1.4% vs 2023)
                        </td>
                        <td className="px-3 py-2 text-gray-900">9%</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="px-3 py-2 text-gray-900">НДФЛ</td>
                        <td className="px-3 py-2 text-gray-900">
                          15 (+2.4% vs 2021)
                        </td>
                        <td className="px-3 py-2 text-gray-900">
                          18 (+2.4% vs 2022)
                        </td>
                        <td className="px-3 py-2 text-gray-900">
                          16 (-1.4% vs 2023)
                        </td>
                        <td className="px-3 py-2 text-gray-900">7%</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="px-3 py-2 text-gray-900">
                          Транспортный налог
                        </td>
                        <td className="px-3 py-2 text-gray-900">
                          10 (+2.4% vs 2021)
                        </td>
                        <td className="px-3 py-2 text-gray-900">
                          12 (+2.4% vs 2022)
                        </td>
                        <td className="px-3 py-2 text-gray-900">
                          11 (-1.4% vs 2023)
                        </td>
                        <td className="px-3 py-2 text-gray-900">4%</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 text-gray-900">Прочие</td>
                        <td className="px-3 py-2 text-gray-900">
                          5 (+2.4% vs 2021)
                        </td>
                        <td className="px-3 py-2 text-gray-900">
                          8 (+2.4% vs 2022)
                        </td>
                        <td className="px-3 py-2 text-gray-900">
                          7 (-1.4% vs 2023)
                        </td>
                        <td className="px-3 py-2 text-gray-900">3%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Payroll Fund and Average Salary Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Фонд оплаты труда
                </h3>
                <span className="text-sm text-gray-500">2022-2024 гг.</span>
              </div>
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">
                  суммарно за периоды 768 тыс. руб
                </div>
                <div className="h-32">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                    minWidth={250}
                    minHeight={150}
                  >
                    <AreaChart
                      data={[
                        { year: "2022", payroll: 300 },
                        { year: "2023", payroll: 234 },
                        { year: "2024", payroll: 234 },
                      ]}
                      margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                    >
                      <Tooltip
                        formatter={(value, name) => [`${value} тыс.руб`, name]}
                        labelFormatter={(label) => `${label} год`}
                        contentStyle={{
                          backgroundColor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <defs>
                        <linearGradient
                          id="payrollGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#ec4899"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#ec4899"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="year"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="payroll"
                        stroke="#ec4899"
                        fill="url(#payrollGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Средняя зар. плата
                </h3>
                <span className="text-sm text-gray-500">2022-2024 гг.</span>
              </div>
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">
                  среднее по периодам 50 тыс. руб
                </div>
                <div className="h-32">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                    minWidth={250}
                    minHeight={150}
                  >
                    <AreaChart
                      data={[
                        { year: "2022", salary: 40 },
                        { year: "2023", salary: 50 },
                        { year: "2024", salary: 60 },
                      ]}
                      margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                    >
                      <Tooltip
                        formatter={(value, name) => [`${value} тыс.руб`, name]}
                        labelFormatter={(label) => `${label} год`}
                        contentStyle={{
                          backgroundColor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <defs>
                        <linearGradient
                          id="salaryGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3b82f6"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3b82f6"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="year"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="salary"
                        stroke="#3b82f6"
                        fill="url(#salaryGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Investment Growth, Profitability, Shares, and Box Plot Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Investment Growth Widget */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Рост инвестиций (по налогам)
                </h3>
              </div>
              <div className="h-32">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                  minWidth={250}
                  minHeight={150}
                >
                  <BarChart
                    data={[
                      { year: "2022", property: 80, land: 60, transport: 40 },
                      { year: "2023", property: 85, land: 65, transport: 45 },
                      { year: "2024", property: 90, land: 70, transport: 50 },
                    ]}
                    margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="year"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                    />
                    <Bar
                      dataKey="property"
                      stackId="a"
                      fill="#ec4899"
                      radius={2}
                    />
                    <Bar dataKey="land" stackId="a" fill="#3b82f6" radius={2} />
                    <Bar
                      dataKey="transport"
                      stackId="a"
                      fill="#1e40af"
                      radius={2}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">имущество</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">земля</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-800 rounded-full"></div>
                  <span className="text-xs text-gray-600">транспорт</span>
                </div>
              </div>
            </div>

            {/* Profitability Widget */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Маржинальность
                </h3>
                <span className="text-sm text-gray-500">2022-2024 гг.</span>
              </div>
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">
                  31% среднее по периодам
                </div>
                <div className="h-32">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                    minWidth={250}
                    minHeight={150}
                  >
                    <AreaChart
                      data={[
                        { year: "2022", margin: 25 },
                        { year: "2023", margin: 35 },
                        { year: "2024", margin: 33 },
                      ]}
                      margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                    >
                      <Tooltip
                        formatter={(value, name) => [`${value}%`, name]}
                        labelFormatter={(label) => `${label} год`}
                        contentStyle={{
                          backgroundColor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <defs>
                        <linearGradient
                          id="marginGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#ec4899"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#ec4899"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="year"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="margin"
                        stroke="#ec4899"
                        fill="url(#marginGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Taxpayer Shares Widget */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Доли налогоплательщиков
                </h3>
                <span className="text-sm text-gray-500">2022-2024 гг.</span>
              </div>
              <div className="h-32 flex items-center justify-center">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                  minWidth={250}
                  minHeight={150}
                >
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'ООО "РУ КМЗ"', value: 23, fill: "#ec4899" },
                        { name: 'АО "ОМПК"', value: 25, fill: "#1e40af" },
                        { name: 'АО "ВБД"', value: 14, fill: "#3b82f6" },
                        {
                          name: 'АО "ГАЗПРОМНЕФТЬ - МНПЗ"',
                          value: 14,
                          fill: "#f8bbd9",
                        },
                        { name: "Прочие", value: 24, fill: "#be185d" },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={20}
                      outerRadius={50}
                      dataKey="value"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span className="text-gray-600">ООО "РУ КМЗ" 23%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-800 rounded-full"></div>
                  <span className="text-gray-600">АО "ОМПК" 25%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">АО "ВБД" 14%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-pink-300 rounded-full"></div>
                  <span className="text-gray-600">ГАЗПРОМНЕФТЬ 14%</span>
                </div>
                <div className="flex items-center gap-1 col-span-2">
                  <div className="w-2 h-2 bg-pink-800 rounded-full"></div>
                  <span className="text-gray-600">Прочие 24%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ReportsPage = () => (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">Дашборд</h1>
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
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">1</span>
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

      {/* Filter Bar */}
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="relative">
            <button
              onClick={() => setCurrentPage("welcome")}
              className="bg-green-500 text-white px-4 py-2 rounded-lg border-2 border-gray-300 shadow-md hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              {selectedIndustry}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">30 дней</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              Сент 12/23 - Нояб 12/23
            </span>
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
        <button
          onClick={() => setCurrentPage("welcome")}
          className="bg-black text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
              clipRule="evenodd"
            />
          </svg>
          Сформировать отчет
        </button>
      </div>

      {/* Reports List */}
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
              <span className="text-black font-medium">
                Отчет № 1203 от 23.05.2025 за последний квартал в
                металлургической отрасли
              </span>
              <button className="bg-white border border-gray-300 px-4 py-2 rounded text-black hover:bg-gray-50 transition-colors">
                Скачать
              </button>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
              <span className="text-black font-medium">
                Отчет № 1203 от 23.05.2025 за последний квартал в
                металлургической отрасли
              </span>
              <button className="bg-white border border-gray-300 px-4 py-2 rounded text-black hover:bg-gray-50 transition-colors">
                Скачать
              </button>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
              <span className="text-black font-medium">
                Отчет № 1203 от 23.05.2025 за последний квартал в
                металлургической отрасли
              </span>
              <button className="bg-white border border-gray-300 px-4 py-2 rounded text-black hover:bg-gray-50 transition-colors">
                Скачать
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const AddCompanyModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 underline">
            Добавить новую компанию
          </h2>
          <button
            onClick={() => setShowAddCompanyModal(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Format Selection */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Выберите формат загрузки данных
          </h3>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setUploadFormat("api")}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                uploadFormat === "api"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              API
            </button>
            <button
              onClick={() => setUploadFormat("excel")}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                uploadFormat === "excel"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Excel
            </button>
            <button
              onClick={() => {
                setCurrentPage("manualentry");
                setShowAddCompanyModal(false);
              }}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                uploadFormat === "manual"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Ручной ввод
            </button>
          </div>
        </div>

        {/* File Upload Area */}
        {uploadFormat === "excel" && (
          <div className="mb-6">
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  handleExcelUpload(file);
                }
              }}
              className="hidden"
              id="excel-file-upload"
            />
            <label
              htmlFor="excel-file-upload"
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer block"
            >
              <svg
                className="w-8 h-8 text-gray-400 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
              <p className="text-sm text-gray-600">
                {uploadStatus === "uploading"
                  ? "Обработка файла..."
                  : uploadStatus === "success"
                  ? "Файл успешно загружен!"
                  : uploadStatus === "error"
                  ? "Ошибка при загрузке файла"
                  : "прикрепите файл"}
              </p>
              {excelFile && (
                <p className="text-xs text-gray-500 mt-1">{excelFile.name}</p>
              )}
            </label>

            {/* Show parsed data preview */}
            {excelData && excelData.length > 0 && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 font-medium mb-2">
                  Найдено компаний: {excelData.length}
                </p>
                <div className="text-xs text-green-700">
                  <p>
                    Первая компания:{" "}
                    {excelData[0]["Наименование организации"] || "Не указано"}
                  </p>
                  <p>ИНН: {excelData[0]["ИНН"] || "Не указан"}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* API Configuration */}
        {uploadFormat === "api" && (
          <div className="mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введите API ключ"
              />
            </div>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={() => {
            if (uploadFormat === "excel" && excelData && excelData.length > 0) {
              // Excel data is already processed and added to companies
              setShowAddCompanyModal(false);
              setCurrentPage("companydata");
              setUploadStatus(null);
              setExcelData(null);
              setExcelFile(null);
            } else if (uploadFormat === "api") {
              // Handle API upload
              setShowAddCompanyModal(false);
            } else {
              // Handle manual entry
              setShowAddCompanyModal(false);
              setCurrentPage("manualentry");
            }
          }}
          disabled={
            uploadFormat === "excel" && (!excelData || excelData.length === 0)
          }
          className={`w-full py-2 px-4 rounded-md transition-colors ${
            uploadFormat === "excel" && (!excelData || excelData.length === 0)
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {uploadFormat === "excel" && excelData && excelData.length > 0
            ? `Добавить ${excelData.length} компаний`
            : "Загрузить"}
        </button>
      </div>
    </div>
  );

  const ManualEntryPage = () => (
    <div className="bg-gray-50 flex min-h-screen">
      <div className="w-64 bg-gray-200">
        <div className="p-4">
          <div className="bg-white p-4 rounded-lg mb-8">
            <div className="flex items-center gap-8">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 border-2 border-gray-400 w-8 h-8 top-1 left-0"></div>
                <div className="absolute inset-0 bg-gray-800 w-8 h-8 transform rotate-45 top-1 left-0">
                  <div className="absolute inset-2 border border-white"></div>
                </div>
              </div>
              <div>
                <div className="text-base font-bold text-black">
                  ИНДУСТРИАЛЬНЫЕ
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
            <div className="bg-blue-600 text-white px-3 py-3 rounded flex items-center gap-3">
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
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.114 11.114 0 01.25-3.762zM6.18 17.846a1 1 0 001.14-.104l4.787-2.67a1 1 0 00.53-.537l1.723-3.447a1 1 0 00-.536-.537l-3.447-1.723a1 1 0 00-.537-.53L6.18 6.846a1 1 0 00-1.14.104l-4.787 2.67a1 1 0 00-.53.537l-1.723 3.447a1 1 0 00.536.537l3.447 1.723a1 1 0 00.537.53l4.787 2.67z" />
              </svg>
              <span className="text-base">Настройки</span>
            </div>
            <div className="px-3 py-3 rounded flex items-center gap-3 text-gray-600 hover:bg-gray-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
              <span className="text-base">Помощь</span>
            </div>
          </nav>
        </div>
      </div>

      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black">
            Добавить новую компанию
          </h1>
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
                <span className="text-xs text-white font-bold">1</span>
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

        {/* Main Content */}
        <div className="p-6 max-w-6xl mx-auto">
          {/* Enterprise Data Section */}
          <div className="bg-white rounded-lg p-6 mb-6">
            <h2 className="text-lg font-bold text-black mb-6">
              Введите данные предприятия
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Выберите отрасль
                </label>
                <div className="relative">
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                    <option>выберите отрасль</option>
                    <option>станкостроительная отрасль</option>
                    <option>инструментальная отрасль</option>
                  </select>
                  <svg
                    className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Подотрасль (Основная)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите подотрасль"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Полное наименование организации
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите полное наименование"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Название предприятия
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите название предприятия"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ИНН
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите ИНН"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Юридический адрес
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введите юридический адрес"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Адрес производства
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введите адрес производства"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Адрес дополнительной площадки
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введите адрес дополнительной площадки"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Основной ОКВЭД
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите основной ОКВЭД"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Производственный ОКВЭД
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите производственный ОКВЭД"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Вид деятельности по основному ОКВЭД
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите вид деятельности"
                />
              </div>
            </div>
          </div>

          {/* Contacts Section */}
          <div className="bg-white rounded-lg p-6 mb-6">
            <h2 className="text-lg font-bold text-black mb-6">Контакты</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ФИО Руководителя
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите ФИО руководителя"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Сайт
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите сайт"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Телефон руководителя
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите телефон"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Дата регистрации
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Почта руководителя
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите email"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Контакты ответственного по ЧС
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите контакты"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Контакт сотрудника организации
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите контакт сотрудника"
                />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <button
              onClick={() => {
                setCurrentPage("companydata");
                setShowAddCompanyModal(false);
              }}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Добавить компанию
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Edit Company Modal
  const EditCompanyModal = ({ editingCompany, onSave, onClose }) => {
    const [formData, setFormData] = useState(editingCompany || {});

    const handleInputChange = (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
      onSave(formData);
    };

    if (!editingCompany) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Редактировать компанию
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Наименование организации
              </label>
              <input
                type="text"
                value={formData["Наименование организации"] || ""}
                onChange={(e) =>
                  handleInputChange("Наименование организации", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ИНН
              </label>
              <input
                type="text"
                value={formData["ИНН"] || ""}
                onChange={(e) => handleInputChange("ИНН", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Руководитель
              </label>
              <input
                type="text"
                value={formData["Руководство"] || ""}
                onChange={(e) =>
                  handleInputChange("Руководство", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Электронная почта
              </label>
              <input
                type="email"
                value={formData["Электронная почта"] || ""}
                onChange={(e) =>
                  handleInputChange("Электронная почта", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Сайт
              </label>
              <input
                type="url"
                value={formData["Сайт"] || ""}
                onChange={(e) => handleInputChange("Сайт", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Основная отрасль
              </label>
              <input
                type="text"
                value={formData["Основная отрасль"] || ""}
                onChange={(e) =>
                  handleInputChange("Основная отрасль", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Delete Company Modal
  const DeleteCompanyModal = ({ editingCompany, onConfirm, onClose }) => {
    if (!editingCompany) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Удалить компанию
              </h3>
              <p className="text-sm text-gray-500">
                Это действие нельзя отменить
              </p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Вы уверены, что хотите удалить компанию{" "}
              <strong>{editingCompany["Наименование организации"]}</strong>?
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Check authentication for protected pages
  if (
    !isAuthenticated &&
    (currentPage === "dashboard" ||
      currentPage === "companydata" ||
      currentPage === "reports" ||
      currentPage === "manualentry" ||
      currentPage === "companydetail")
  ) {
    return <AuthPage />;
  }

  if (currentPage === "welcome") return <WelcomePage />;
  if (currentPage === "auth") return <AuthPage />;
  if (currentPage === "enterprise") return <EnterprisePage />;
  if (currentPage === "success") return <SuccessPage />;
  if (currentPage === "dashboard") return <DashboardPage />;
  if (currentPage === "companydata") return <CompanyDataPage />;
  if (currentPage === "reports") return <ReportsPage />;
  if (currentPage === "manualentry") return <ManualEntryPage />;
  if (currentPage === "companydetail" && selectedCompany)
    return <CompanyDetailPage company={selectedCompany} />;

  return (
    <>
      <WelcomePage />
      {showEditModal && (
        <EditCompanyModal
          editingCompany={editingCompany}
          onSave={saveEditedCompany}
          onClose={() => setShowEditModal(false)}
        />
      )}
      {showDeleteModal && (
        <DeleteCompanyModal
          editingCompany={editingCompany}
          onConfirm={confirmDeleteCompany}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
}

export default App;
