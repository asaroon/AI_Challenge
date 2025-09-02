import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { PiggyBank, Users, Baby, DollarSign, BarChart3, Target, RefreshCw, Trash2, Car, TrendingUp, PlusCircle, X, Info, Gift, Plane, Hotel, Map, Bell, GraduationCap, Star, ChevronsUp, Wallet, HandCoins, Drama, Home } from 'lucide-react';

// --- 초기 데이터 및 설정 ---
const savingsRates = [
  { value: 0.4, label: '추천' }, { value: 0.5, label: '50%' },
  { value: 0.6, label: '60%' }, { value: 0.7, label: '70%' },
];
const incomeBrackets = [
  { value: 2500000, label: '250만원' }, { value: 3000000, label: '300만원' },
  { value: 3500000, label: '350만원' }, { value: 4000000, label: '400만원' },
  { value: 5000000, label: '500만원' }, { value: 6000000, label: '600만원' },
  { value: 7000000, label: '700만원' }, { value: 8000000, label: '800만원' },
  { value: 9000000, label: '900만원' }, { value: 10000000, label: '1000만원 이상' },
];
const travelCourses = {
  '파리 집중 (프랑스)': { adult: 3500000, child: 3200000, countries: '프랑스 (파리, 베르사유)' },
  '스위스 자연 (스위스)': { adult: 3800000, child: 3500000, countries: '스위스 (인터라켄, 루체른)' },
  '로마/피렌체 (이탈리아)': { adult: 3600000, child: 3300000, countries: '이탈리아 (로마, 피렌체)' },
  '프라하/비엔나 (동유럽)': { adult: 3200000, child: 2900000, countries: '체코, 오스트리아' },
};
const travelDetails = {
    '파리 집중 (프랑스)': {
        arrivalCityCode: 'PAR', yanoljaSearch: '파리',
        flights: [
            { airline: '에어프랑스', price: 1450000, layovers: 0, departureTime: '13:15', totalHours: 14 },
            { airline: '대한항공', price: 1550000, layovers: 0, departureTime: '12:30', totalHours: 14.5 },
            { airline: '카타르항공', price: 1250000, layovers: 1, departureTime: '23:50', totalHours: 18 },
            { airline: '에미레이트항공', price: 1300000, layovers: 1, departureTime: '23:55', totalHours: 17.5 },
            { airline: '터키항공', price: 1280000, layovers: 1, departureTime: '22:45', totalHours: 19 },
        ],
        hotels: [
            { name: '이비스 파리 투르 에펠', location: '에펠탑 인근', rating: 8.2, price: 250000 },
            { name: '호텔 루멘 파리 루브르', location: '루브르 인근', rating: 8.8, price: 450000 },
            { name: '시티즌M 파리 가르 드 리옹', location: '리옹역 인근', rating: 9.0, price: 300000 },
            { name: '노보텔 파리 레알', location: '레알역 인근', rating: 8.5, price: 350000 },
            { name: '풀만 파리 타워 에펠', location: '에펠탑 전망', rating: 8.6, price: 550000 },
        ],
        itinerary: [
            '1일차: 파리 도착, 센 강변 산책하며 시차 적응',
            '2일차: [예술] 루브르 박물관 → 뛸르리 정원 → 오르세 미술관',
            '3일차: [상징] 에펠탑 → 샹드마르스 공원 피크닉 → 바토무슈 유람선',
            '4일차: [역사] 베르사유 궁전과 정원 (전일 투어)',
            '5일차: [낭만] 몽마르뜨 언덕 (사랑해벽, 성심성당) → 물랑루즈',
            '6일차: [도시] 마레지구 (보주 광장, 편집샵) → 시내 자유 쇼핑',
            '7일차: 출국 준비 및 공항 이동',
        ]
    },
    '스위스 자연 (스위스)': {
        arrivalCityCode: 'ZRH', yanoljaSearch: '취리히',
        flights: [
            { airline: '스위스 국제항공', price: 1600000, layovers: 0, departureTime: '09:30', totalHours: 13.5 },
            { airline: '루프트한자', price: 1400000, layovers: 1, departureTime: '14:20', totalHours: 16 },
            { airline: 'KLM', price: 1450000, layovers: 1, departureTime: '23:55', totalHours: 17 },
            { airline: '카타르항공', price: 1350000, layovers: 1, departureTime: '23:50', totalHours: 17.5 },
            { airline: '에미레이트항공', price: 1380000, layovers: 1, departureTime: '23:55', totalHours: 17 },
        ],
        hotels: [
            { name: '백패커스 빌라 소넨호프', location: '인터라켄', rating: 9.1, price: 180000 },
            { name: '호텔 인터라켄', location: '인터라켄', rating: 8.5, price: 350000 },
            { name: '호텔 드 알프', location: '인터라켄', rating: 8.8, price: 400000 },
            { name: '호텔 채플 브릿지 루체른', location: '루체른', rating: 9.2, price: 450000 },
            { name: '빅토리아 융프라우 그랜드 호텔', location: '인터라켄', rating: 9.4, price: 800000 },
        ],
        itinerary: [
            '1일차: 취리히 도착, 기차로 인터라켄 이동 및 체크인',
            '2일차: [알프스] 융프라우요흐 등반 (유럽의 지붕)',
            '3일차: [액티비티] 그린델발트 피르스트 (클리프 워크, 펀패키지)',
            '4일차: [자연] 라우터브루넨 계곡, 이젤발트 마을 산책',
            '5일차: [도시] 기차로 루체른 이동, 카펠교 및 구시가지 탐방',
            '6일차: [파노라마] 리기산 등반 (산들의 여왕)',
            '7일차: 취리히 공항 이동 및 출국',
        ]
    },
     '로마/피렌체 (이탈리아)': {
        arrivalCityCode: 'ROM', yanoljaSearch: '로마',
        flights: [
            { airline: 'ITA 항공', price: 1400000, layovers: 0, departureTime: '14:15', totalHours: 13 },
            { airline: '대한항공', price: 1580000, layovers: 0, departureTime: '13:00', totalHours: 13 },
            { airline: '카타르항공', price: 1280000, layovers: 1, departureTime: '23:50', totalHours: 17 },
            { airline: '에티하드 항공', price: 1250000, layovers: 1, departureTime: '17:50', totalHours: 18 },
            { airline: '터키항공', price: 1300000, layovers: 1, departureTime: '22:45', totalHours: 18.5 },
        ],
        hotels: [
            { name: '더 하이브 호텔 (로마)', location: '테르미니역 인근', rating: 9.0, price: 300000 },
            { name: '호텔 인디고 로마', location: '트라스테베레', rating: 8.9, price: 400000 },
            { name: 'c-호텔 암바시아토리 (피렌체)', location: '중앙역 인근', rating: 8.8, price: 350000 },
            { name: '호텔 다비드 (피렌체)', location: '아르노 강변', rating: 9.5, price: 450000 },
            { name: '그랜드 호텔 미네르바 (피렌체)', location: '두오모 인근', rating: 9.2, price: 550000 },
        ],
        itinerary: [
            '1일차: 로마 도착, 트레비 분수 & 스페인 광장 야경',
            '2일차: [고대 로마] 콜로세움, 포로 로마노, 판테온',
            '3일차: [예술] 바티칸 시국 (성 베드로 대성당, 박물관)',
            '4일차: [르네상스] 기차로 피렌체 이동, 미켈란젤로 광장 석양',
            '5일차: 피렌체 두오모 통합권 (쿠폴라, 종탑 등반)',
            '6일차: [도시] 우피치 미술관 → 베키오 다리 → 가죽 시장',
            '7일차: 피렌체 공항 이동 및 출국',
        ]
    },
    '프라하/비엔나 (동유럽)': {
        arrivalCityCode: 'PRG', yanoljaSearch: '프라하',
        flights: [
            { airline: '대한항공', price: 1500000, layovers: 0, departureTime: '12:45', totalHours: 12.5 },
            { airline: 'LOT 폴란드 항공', price: 1200000, layovers: 1, departureTime: '10:15', totalHours: 15 },
            { airline: '루프트한자', price: 1250000, layovers: 1, departureTime: '14:20', totalHours: 16 },
            { airline: '카타르항공', price: 1180000, layovers: 1, departureTime: '23:50', totalHours: 18 },
            { airline: '핀에어', price: 1220000, layovers: 1, departureTime: '10:20', totalHours: 15.5 },
        ],
        hotels: [
            { name: '그란디움 호텔 프라하', location: '바츨라프 광장', rating: 9.0, price: 200000 },
            { name: '힐튼 프라하 올드 타운', location: '구시가지 인근', rating: 8.7, price: 280000 },
            { name: '호텔 라트하우스 (비엔나)', location: '시청 인근', rating: 9.1, price: 250000 },
            { name: '힐튼 비엔나 플라자', location: '링슈트라세', rating: 8.8, price: 320000 },
            { name: '재즈 인 더 시티 비엔나', location: '노이바우', rating: 9.2, price: 300000 },
        ],
        itinerary: [
            '1일차: 프라하 도착, 구시가지 광장 & 천문 시계탑 야경',
            '2일차: [역사] 프라하 성 (성 비투스 대성당, 황금소로)',
            '3일차: [낭만] 카를교 산책 → 말라 스트라나 지구 → 존 레논 벽',
            '4일차: [음악] 기차로 비엔나 이동, 저녁 오페라 공연 관람',
            '5일차: [궁전] 쇤부른 궁전과 정원',
            "6일차: [예술] 벨베데레 궁전 (클림트 '키스') → 시내 자유시간",
            '7일차: 비엔나 공항 이동 및 출국',
        ]
    }
};
const baseRatios = {
  '고정지출': {
    '주거비': { ratio: 0.15, type: 'fixed', essential: true, sub: { '월세/관리비': 0.15 }, min: 700000 },
    '통신비': { ratio: 0.04, type: 'fixed', essential: true, sub: { '통신요금': 0.04 } },
    '구독료': { ratio: 0.01, type: 'fixed', essential: false, sub: { 'OTT/음악 등': 0.01 } },
    '보험': { ratio: 0.03, type: 'fixed', essential: true, sub: { '실손/기타보험': 0.03 } },
  },
  '생활비 (변동지출)': {
    '식비': { ratio: 0.15, type: 'variable', essential: true, sub: { '식료품': 0.10, '외식/배달': 0.05 }, min: 450000 },
    '생활용품': { ratio: 0.03, type: 'variable', essential: true, sub: { '생필품/잡화': 0.03 } },
    '의료/건강': { ratio: 0.03, type: 'variable', essential: true, sub: { '병원/약국': 0.03 } },
    '교통': { ratio: 0.07, type: 'variable', essential: true, sub: { '대중교통': 0.04, '차량유지비': 0.03 } },
  },
  '문화여가비 (선택지출)': {
    '문화생활': { ratio: 0.02, type: 'variable', essential: false, sub: { '취미/여가': 0.02 }, min: 100000 },
    '개인용돈/자기계발': { ratio: 0.02, type: 'variable', essential: false, sub: { '용돈/도서/강의': 0.02 } },
    '미용/의류/쇼핑': { ratio: 0.015, type: 'variable', essential: false, sub: { '미용실/화장품': 0.0075, '의류/잡화': 0.0075 } },
    '경조사/선물': { ratio: 0.04, type: 'variable', essential: false, sub: { '경조사비': 0.02, '선물': 0.02 } },
  },
  '육아 (미취학 아동)': {
    '보육/양육비': { ratio: 0.15, type: 'variable', essential: true, sub: { '어린이집/유치원': 0.10, '기저귀/분유 등': 0.05 } },
  },
  '교육 (초/중/고등학생)': {
    '학원/교육비': { ratio: 0.18, type: 'variable', essential: true, sub: { '주요과목 학원': 0.12, '예체능/기타': 0.06 } },
  }
};
const jjantechTips = {
  '고정지출': {
    icon: Home,
    description: '한번 줄이면 계속 절약됩니다!',
    items: [
      { category: '주거비', common: '정부 지원(청년 월세 지원, 각종 주택자금대출 등)을 적극 활용하세요.', single: '월세가 저렴한 역세권 빌라/오피스텔을 우선 고려하고, 공공임대주택 자격 요건을 주기적으로 확인하세요.', family: '금리가 낮은 정부 지원 주택담보대출로 갈아탈 수 있는지 확인하고, 아이가 어릴 때는 학군보다 직장 근처를 고려하세요.' },
      { category: '통신비', common: "'자급제폰 + 알뜰 요금제' 조합은 통신비 절약의 정석입니다. 3사 통신사 대비 50% 이상 절약 가능합니다.", single: '데이터 사용량이 많지 않다면 월 1만 원대 요금제도 충분하며, 인터넷 단독 상품을 이용하는 것을 추천합니다.', family: "'인터넷+TV+가족 휴대폰 결합' 할인을 최대한 활용하고, 자녀의 첫 스마트폰은 저렴한 키즈폰으로 시작하세요." },
      { category: '보험료', common: "'보험다모아'에서 중복 보장을 확인하고, 비싼 종신보험보다 '실손 보험' 하나만 제대로 유지하는 것이 효율적입니다.", single: '사회초년생은 실손보험 외의 다른 보험 가입은 최대한 보수적으로 접근하세요.', family: "어린이 보험은 비갱신형, 무해지환급형으로, 가장의 부재는 종신보험보다 저렴한 정기보험으로 대비하세요." },
      { category: '구독료', common: "'하나만 남기고 모두 해지'하는 것을 원칙으로 삼고, 가족/친구와 계정 공유가 가능한 서비스는 적극 활용하세요.", single: '월 결제 구독 서비스는 정말 매일 사용하는 것이 아니라면 과감히 정리하세요.', family: '아이들이 보는 OTT는 하나로 통일하고, 결제일 전에 아이와 함께 유지 여부를 상의하며 경제 교육의 기회로 삼아보세요.' },
    ]
  },
  '생활비': {
    icon: Wallet,
    description: '매일의 습관이 돈이 됩니다!',
    items: [
      { category: '식비', common: "'냉장고 파먹기'를 생활화하고, 배달 앱 대신 포장 할인을 이용하거나 직접 조리하는 횟수를 늘리세요.", single: '밀프렙(Meal-prep)을 통해 일주일치 식사를 미리 준비하면 외식과 배달을 획기적으로 줄일 수 있습니다.', family: '주간 식단표를 미리 짜고, 대용량 식자재 마트를 이용하여 온 가족이 함께 먹는 식료품을 저렴하게 구매하세요.' },
      { category: '교통비', common: "월 소득 400만 원 이하의 1~2인 가구라면, 자동차 구매는 1억 모으기 목표에 치명적일 수 있습니다. 'K-패스'나 '기후동행카드'는 필수입니다.", single: '2~3 정거장 거리는 걷거나 자전거를 이용하는 습관을 들이세요.', family: "'차 없는 날'을 정해서 대중교통을 이용하거나, 가까운 거리는 아이와 함께 걸으며 대화하는 시간을 가져보세요." },
      { category: '생활용품', common: "'노브랜드/PB상품'과 리필 제품을 이용하면 비용과 쓰레기를 동시에 줄일 수 있습니다.", single: "물건을 사기 전, '당근마켓'에 더 저렴한 중고 제품이 있는지 먼저 확인하세요.", family: '아이 장난감이나 책은 중고 거래나 지역 육아나눔터를 통해 해결하면 큰돈을 아낄 수 있습니다.' },
    ]
  },
  '문화여가비': {
    icon: Drama,
    description: '돈 안 쓰는 즐거움을 찾아보세요!',
    items: [
      { category: '문화생활', common: '지역 도서관은 책, 영화 DVD, 전자책까지 모두 무료로 즐길 수 있는 최고의 문화 공간입니다. 무료 전시회, 지역 축제 등도 적극 활용하세요.', single: "'집에서 할 수 있는 취미'(홈트, 독서 등)를 개발하여 밖에서 쓰는 돈을 줄여보세요.", family: '공원, 숲, 강변 등 무료로 즐길 수 있는 자연 속에서 아이와 함께 시간을 보내세요. 지자체 육아지원센터의 무료 프로그램도 훌륭합니다.' },
      { category: '쇼핑', common: "'1년 동안 옷 안 사기 챌린지'처럼 극단적인 목표를 세워보세요. 꼭 필요한 물건이 아니라면, '장바구니'에만 담아두고 최소 3일 이상 고민하는 습관을 들이세요.", single: "'당근마켓'을 적극 활용하여 필요한 물건은 저렴하게 사고, 안 쓰는 물건은 팔아서 부수입을 만드세요.", family: '아이 옷은 물려받거나 중고로 구매하고, 금방 자라는 아이의 특성을 고려하여 너무 많이 사지 않도록 주의하세요.' },
    ]
  }
};


// --- 헬퍼 함수 ---
const formatCurrency = (amount) => `${Math.round(amount).toLocaleString('ko-KR')}원`;
const formatNumber = (amount) => `${Math.round(amount).toLocaleString('ko-KR')}`;

// --- 컴포넌트 ---
const IconWrapper = ({ icon: Icon, children }) => (<div className="flex items-center space-x-2 text-slate-300"><Icon className="w-5 h-5 text-indigo-400" /><span className="font-medium">{children}</span></div>);

const JjantechTipsComponent = ({ adults, children }) => {
  const isSingle = adults === 1 && children === 0;
  const isFamily = adults > 1 || children > 0;

  return (
    <div className="mt-8 space-y-8">
      <h2 className="text-xl font-semibold text-green-400 border-b border-green-800 pb-3 flex items-center gap-3">
        <HandCoins className="w-6 h-6" />'1억 목표' 초강력 짠테크 가이드
      </h2>
      {Object.entries(jjantechTips).map(([majorCat, data]) => (
        <div key={majorCat} className="bg-slate-700/50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2"><data.icon className="w-5 h-5 text-indigo-400" />{majorCat}</h3>
          <p className="text-xs text-slate-400 mb-4 ml-8">{data.description}</p>
          <div className="space-y-3 pl-8">
            {data.items.map(item => (
              <div key={item.category}>
                <h4 className="font-semibold text-indigo-300">{item.category}</h4>
                <ul className="list-disc list-inside text-sm text-slate-300 mt-1 space-y-1">
                  {item.common && <li>{item.common}</li>}
                  {isSingle && item.single && <li><span className="font-bold text-sky-300 mr-1">[1인 가구 Tip]</span>{item.single}</li>}
                  {isFamily && item.family && <li><span className="font-bold text-teal-300 mr-1">[다인 가구 Tip]</span>{item.family}</li>}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const SavingsTable = ({ mainGoalSavings, travelSavings, totalTravelCost, isIncreaseApplied, monthsToGoal }) => {
  if (!mainGoalSavings || mainGoalSavings <= 0) return null;
  const GOAL_AMOUNT = 100000000;
  const yearsToGoal = (monthsToGoal / 12).toFixed(1);
  const yearlyData = [];

  if (isIncreaseApplied) {
      let currentSavings = 0; let currentTravelSavings = 0;
      let monthlySavingsForSim = mainGoalSavings; let travelSavingsForSim = travelSavings;
      const annualIncreaseRate = 0.025;
      for (let m = 1; m <= monthsToGoal; m++) {
          currentSavings += monthlySavingsForSim; currentTravelSavings += travelSavingsForSim;
          if (m % 12 === 0) {
              yearlyData.push({ year: m / 12, mainAmount: currentSavings, travelAmount: Math.min(totalTravelCost, currentTravelSavings) });
              monthlySavingsForSim *= (1 + annualIncreaseRate); travelSavingsForSim *= (1 + annualIncreaseRate);
          }
      }
      if (monthsToGoal % 12 !== 0) { yearlyData.push({ year: yearsToGoal, mainAmount: GOAL_AMOUNT, travelAmount: totalTravelCost }); }
  } else {
      const fullYears = Math.floor(monthsToGoal / 12);
      for (let i = 1; i <= fullYears; i++) { yearlyData.push({ year: i, mainAmount: mainGoalSavings * 12 * i, travelAmount: Math.min(totalTravelCost, travelSavings * 12 * i) }); }
      if (monthsToGoal % 12 > 0) { yearlyData.push({ year: yearsToGoal, mainAmount: GOAL_AMOUNT, travelAmount: totalTravelCost }); }
  }
  return (<div className="bg-slate-700/50 p-6 rounded-2xl"><h3 className="text-lg font-semibold text-indigo-400 mb-2 flex items-center gap-2"><TrendingUp className="w-5 h-5" />목표 달성 시뮬레이션</h3><p className="text-slate-300 mb-6">월 <span className="font-bold text-green-400">{formatCurrency(mainGoalSavings)}</span> 저축 시 <span className="font-bold text-green-400">{yearsToGoal}년</span> 후 <span className="font-bold text-green-400">1억</span> 달성이 가능해요!</p><div className="w-full bg-slate-700 p-4 rounded-lg overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-slate-600"><th className="p-2 text-sm font-medium text-slate-300">연차</th><th className="p-2 text-sm font-medium text-slate-300 text-right">누적 종자돈</th><th className="p-2 text-sm font-medium text-slate-300 text-right">누적 여행 경비</th></tr></thead><tbody>{yearlyData.map((data, index) => (<tr key={index} className="border-b border-slate-600/50"><td className="p-2 text-slate-400">{data.year}년</td><td className="p-2 text-slate-200 font-mono text-right">{formatCurrency(data.mainAmount)}</td><td className="p-2 text-amber-200 font-mono text-right">{formatCurrency(data.travelAmount)}</td></tr>))}</tbody></table></div>{isIncreaseApplied && (<div className="mt-4 text-xs text-slate-400 text-center">* 월 소득 400만원 미만인 경우, 목표 달성 현실화를 위해 보수적인 연봉 상승률(2.5%)을 반영하여 시뮬레이션했습니다.</div>)}</div>);
};

const AddCategoryForm = ({ type, onAdd }) => {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const handleAdd = () => {
        if (name && amount > 0) { onAdd({ id: Date.now(), name, amount: Number(amount), type }); setName(''); setAmount(''); }
    };
    return (<div className="flex gap-2 mt-2 p-2 bg-slate-900/50 rounded-lg"><input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="항목명" className="flex-1 bg-slate-600 text-white rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" /><input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="금액(원)" className="w-28 bg-slate-600 text-white rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" /><button onClick={handleAdd} className="p-2 bg-indigo-600 rounded-md hover:bg-indigo-500"><PlusCircle className="w-5 h-5" /></button></div>);
};

const TravelPlanner = ({ adults, children, course, onNotify, notificationSet }) => {
    const details = travelDetails[course];
    
    const generateUrls = () => {
        const info = travelDetails[course];
        if (!info) return {};

        const getNextHolidayDate = () => {
            const today = new Date();
            const year = today.getFullYear();
            const holidays = [
                new Date(year, 0, 1), new Date(year, 2, 1), new Date(year, 4, 5), new Date(year, 5, 6), new Date(year, 7, 15),
                new Date(year, 9, 3), new Date(year, 9, 9), new Date(year, 11, 25),
                new Date(year + 1, 0, 1), new Date(year + 1, 2, 1), 
            ];
            let nextHoliday = holidays.find(h => h > today && (h.getTime() - today.getTime()) / (1000 * 3600 * 24) < 180);
            return nextHoliday || new Date(new Date().setMonth(new Date().getMonth() + 6));
        }

        const depDate = getNextHolidayDate();
        const arrDate = new Date(depDate);
        arrDate.setDate(depDate.getDate() + 7);

        const formatDate = (date, separator = '') => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}${separator}${month}${separator}${day}`;
        };
        
        const yanoljaFlightUrl = `https://flight-web.yanolja.com/flights/list?departurePlaceTypeCode=CITY&departurePlaceCode=SEL&arrivalPlaceTypeCode=CITY&arrivalPlaceCode=${info.arrivalCityCode}&cabinClasses=ECONOMY&adultsCount=${adults}&childrenCount=${children}&outboundDepartureDate=${formatDate(depDate, '-')}&inboundDepartureDate=${formatDate(arrDate, '-')}`;
        const yanoljaHotelUrl = `https://nol.yanolja.com/results?keyword=${encodeURIComponent(info.yanoljaSearch)}&category=global`;
        
        return { yanoljaFlightUrl, yanoljaHotelUrl };
    };
    
    const urls = generateUrls();

    return (<div className="mt-8 space-y-6"><h3 className="text-lg font-semibold text-amber-400 mb-3 flex items-center gap-2"><Plane className="w-5 h-5" />유럽 여행 계획: {course}</h3><div className="bg-slate-700/50 p-4 rounded-lg"><h4 className="font-semibold text-slate-200 mb-2">추천 일정 (7일)</h4><ol className="list-decimal list-inside text-sm text-slate-300 space-y-1">{details.itinerary.map((item, i) => <li key={i}>{item}</li>)}</ol></div><div className="bg-slate-700/50 p-4 rounded-lg"><h4 className="font-semibold text-slate-200 mb-2">최근 항공권/숙소 가격 검색</h4><div className="space-y-4"><div className="space-y-2"> <p className="font-bold flex items-center gap-2 text-sm"><Plane className="w-4 h-4" />추천 항공편</p>{details.flights.map(f => (<div key={f.airline} className="bg-slate-800 p-3 rounded text-xs"><div className="flex justify-between items-center"><div className="w-2/5"><p className="font-bold text-slate-200">{f.airline}</p><p className="text-slate-400">{f.departureTime} 출발 / {f.layovers === 0 ? '직항' : '경유 1회'}</p></div><div className="text-right"><p className="font-semibold text-amber-400">{formatCurrency(f.price * (adults + children))}</p><p className="text-slate-500 text-[10px]">왕복 총액 / {adults + children}인</p></div><a href={urls.yanoljaFlightUrl} target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-1 px-2 rounded text-center">예약하기</a></div></div>))}</div><div className="space-y-2"><p className="font-bold flex items-center gap-2 text-sm"><Hotel className="w-4 h-4" />추천 숙소</p>{details.hotels.map(h => (<div key={h.name} className="bg-slate-800 p-3 rounded text-xs"><div className="flex justify-between items-center"><div className="w-2/5"><p className="font-bold text-slate-200 truncate">{h.name}</p><p className="text-slate-400 flex items-center gap-1"><Star className="w-3 h-3 text-amber-500" />{h.rating} / {h.location}</p></div><div className="text-right"><p className="font-semibold text-amber-400">{formatCurrency(h.price * 7)}</p><p className="text-slate-500 text-[10px]">7박 총액</p></div><a href={urls.yanoljaHotelUrl} target="_blank" rel="noopener noreferrer" className="bg-pink-600 hover:bg-pink-500 text-white font-bold py-1 px-2 rounded text-center">예약하기</a></div></div>))}</div></div></div>{notificationSet ? (<div className="bg-green-800/50 text-green-200 p-4 rounded-lg text-center font-semibold">✅ 예약 알림이 설정되었습니다! 목표 달성 3개월 전에 알려드릴게요.</div>) : (<button onClick={onNotify} className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-transform transform hover:scale-105"><Bell className="w-5 h-5" />예약 알림받기</button>)}</div>);
};

const App = () => {
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [childStage, setChildStage] = useState('preschooler');
  const [income, setIncome] = useState(3000000);
  const [isCustomIncome, setIsCustomIncome] = useState(false);
  const [hasCar, setHasCar] = useState(false);
  const [targetSavingsRate, setTargetSavingsRate] = useState(0.4);
  const [travelCourse, setTravelCourse] = useState('파리 집중 (프랑스)');
  const [excludedCategories, setExcludedCategories] = useState([]);
  const [customExpenses, setCustomExpenses] = useState({});
  const [customMajorExpenses, setCustomMajorExpenses] = useState({});
  const [addedCategories, setAddedCategories] = useState([]);
  const [budget, setBudget] = useState(null);
  const [notificationSet, setNotificationSet] = useState(false);

  const calculateBudget = useCallback(() => {
    const totalIncome = Number(income);
    if (isNaN(totalIncome) || totalIncome <= 0) return;

    let recommendedRate;
    if (adults <= 2 && children === 0) {
        recommendedRate = 0.45 + (totalIncome / 4000000) * 0.20 - (adults - 1) * 0.05;
    } else {
        recommendedRate = 0.45 + (totalIncome / 5000000) * 0.15 - (adults - 1) * 0.07 - children * 0.12;
    }
    
    let finalRecommendedRate = Math.max(0.30, Math.min(0.85, recommendedRate));
    let currentTargetRate = targetSavingsRate === 0.4 ? finalRecommendedRate : targetSavingsRate;

    const allBaseCategories = Object.entries(baseRatios).flatMap(([majorCat, major]) => 
        Object.entries(major).map(([minorCat, data]) => ({ majorCat, minorCat, ...data }))
    );
    
    let nonNegotiableSpending = 0;
    Object.values(customExpenses).forEach(amount => { nonNegotiableSpending += Number(amount); });
    Object.values(customMajorExpenses).forEach(amount => { nonNegotiableSpending += Number(amount); });
    addedCategories.forEach(cat => { nonNegotiableSpending += cat.amount; });

    if (adults === 1 && children === 0) {
        let minLivingCost = 0;
        if (!('식비' in customExpenses)) minLivingCost += baseRatios['생활비 (변동지출)'].식비.min;
        if (!('문화생활' in customExpenses)) minLivingCost += baseRatios['문화여가비 (선택지출)'].문화생활.min;

        if(nonNegotiableSpending + minLivingCost > totalIncome * (1 - currentTargetRate)) {
            const shortfall = (nonNegotiableSpending + minLivingCost) - (totalIncome * (1-currentTargetRate));
            currentTargetRate -= (shortfall / totalIncome);
            finalRecommendedRate = currentTargetRate;
        }
    }

    const totalSavingsGoal = totalIncome * currentTargetRate;
    const totalSpendable = totalIncome - totalSavingsGoal;

    let calculatedBudget = {};
    let totalCalculatedSpending = 0;
    Object.keys(baseRatios).forEach(majorCat => { calculatedBudget[majorCat] = { items: {}, total: 0 }; });

    let initialBudget = {};
    let totalInitialRatio = 0;
    allBaseCategories.forEach(cat => {
        if (cat.majorCat.includes('미취학') && (children === 0 || childStage !== 'preschooler')) return;
        if (cat.majorCat.includes('학생') && (children === 0 || childStage !== 'student')) return;
        totalInitialRatio += cat.ratio;
    });

    allBaseCategories.forEach(cat => {
        if (cat.majorCat.includes('미취학') && (children === 0 || childStage !== 'preschooler')) return;
        if (cat.majorCat.includes('학생') && (children === 0 || childStage !== 'student')) return;
        if (!initialBudget[cat.majorCat]) initialBudget[cat.majorCat] = { items: {}, total: 0 };
        const amount = totalSpendable * (cat.ratio / totalInitialRatio);
        initialBudget[cat.majorCat].items[cat.minorCat] = { amount };
        initialBudget[cat.majorCat].total += amount;
    });

    let fixedSpend = 0;
    Object.values(customMajorExpenses).forEach(amount => fixedSpend += Number(amount));
    Object.entries(customExpenses).forEach(([minorCat, amount]) => {
        const majorCat = allBaseCategories.find(c => c.minorCat === minorCat)?.majorCat;
        if (!customMajorExpenses[majorCat]) {
            fixedSpend += Number(amount);
        }
    });
    addedCategories.forEach(cat => fixedSpend += cat.amount);

    const flexibleSpendable = totalSpendable - fixedSpend;
    let flexibleRatioSum = 0;
    allBaseCategories.forEach(cat => {
        if (customExpenses[cat.minorCat] === undefined && customMajorExpenses[cat.majorCat] === undefined) {
             if (cat.majorCat.includes('미취학') && (children === 0 || childStage !== 'preschooler')) return;
             if (cat.majorCat.includes('학생') && (children === 0 || childStage !== 'student')) return;
             flexibleRatioSum += cat.ratio;
        }
    });

    allBaseCategories.forEach(cat => {
        if (cat.majorCat.includes('미취학') && (children === 0 || childStage !== 'preschooler')) return;
        if (cat.majorCat.includes('학생') && (children === 0 || childStage !== 'student')) return;

        let amount = 0;
        if (customMajorExpenses[cat.majorCat] !== undefined) {
            const majorTotal = customMajorExpenses[cat.majorCat];
            const initialMajorTotal = initialBudget[cat.majorCat]?.total || 0;
            const initialMinorAmount = initialBudget[cat.majorCat]?.items[cat.minorCat]?.amount || 0;
            amount = initialMajorTotal > 0 ? majorTotal * (initialMinorAmount / initialMajorTotal) : 0;
        } else if (customExpenses[cat.minorCat] !== undefined) {
            amount = customExpenses[cat.minorCat];
        } else {
            amount = flexibleRatioSum > 0 ? flexibleSpendable * (cat.ratio / flexibleRatioSum) : 0;
        }
        
        if (adults === 1 && children === 0 && cat.min && amount < cat.min) {
            amount = cat.min;
        }

        calculatedBudget[cat.majorCat].items[cat.minorCat] = { amount: Math.round(amount / 1000) * 1000, sub: {}, type: cat.type };
    });

    addedCategories.forEach(cat => {
        const majorCatKey = cat.type === 'fixed' ? '고정지출' : '변동지출';
        calculatedBudget[majorCatKey].items[cat.name] = { amount: cat.amount, sub: {}, type: cat.type, isAdded: true, id: cat.id };
    });

    Object.entries(calculatedBudget).forEach(([majorCat, data]) => {
        let majorTotal = 0;
        Object.values(data.items).forEach(item => majorTotal += item.amount);
        data.total = majorTotal;
        totalCalculatedSpending += majorTotal;
    });

    const finalTotalSavings = totalIncome - totalCalculatedSpending;
    const selectedCourse = travelCourses[travelCourse];
    const totalTravelCost = selectedCourse.adult * adults + selectedCourse.child * children;
    const mainGoalSavings = finalTotalSavings > 0 ? finalTotalSavings / (1 + totalTravelCost / 100000000) : 0;
    const travelSavings = finalTotalSavings > 0 ? finalTotalSavings - mainGoalSavings : 0;

    let monthsToGoal = Infinity;
    let isIncreaseApplied = false;
    const GOAL_AMOUNT = 100000000;

    if (mainGoalSavings > 0) {
        if (totalIncome < 4000000) {
            isIncreaseApplied = true;
            let currentSavings = 0; let monthlySavingsForSim = mainGoalSavings; let months = 0;
            const annualIncreaseRate = 0.025;
            while (currentSavings < GOAL_AMOUNT) {
                months++; currentSavings += monthlySavingsForSim;
                if (months % 12 === 0) { monthlySavingsForSim *= (1 + annualIncreaseRate); }
            }
            monthsToGoal = months;
        } else {
            monthsToGoal = Math.ceil(GOAL_AMOUNT / mainGoalSavings);
        }
    }
    
    const isSlow = monthsToGoal / 12 > 10;
    const goalDate = new Date(); goalDate.setMonth(goalDate.getMonth() + monthsToGoal);
    const goalYear = goalDate.getFullYear();
    const holidays = { 2028: "추석 황금연휴 (9/30~10/9)", 2029: "설날 연휴 (2/12~2/15)" };
    const suggestedTravelPeriod = holidays[goalYear] || holidays[goalYear + 1] || `${goalYear+1}년 연휴`;

    Object.values(calculatedBudget).forEach(major => {
        Object.entries(major.items).forEach(([minorCat, itemData]) => {
            const baseData = allBaseCategories.find(c => c.minorCat === minorCat);
            if (!baseData || itemData.isAdded) return;
            if (minorCat === '교통' && !hasCar) { itemData.sub['대중교통'] = itemData.amount; itemData.sub['차량유지비'] = 0; } 
            else { let subTotalRatio = Object.values(baseData.sub).reduce((a, b) => a + b, 0); Object.entries(baseData.sub).forEach(([subCat, subRatio]) => { if (!hasCar && subCat === '차량유지비') { itemData.sub[subCat] = 0; return; } itemData.sub[subCat] = subTotalRatio > 0 ? itemData.amount * (subRatio / subTotalRatio) : 0; }); }
        });
    });

    setBudget({
      totalIncome, totalSavings: finalTotalSavings, mainGoalSavings, travelSavings, totalTravelCost,
      suggestedTravelPeriod, totalSpending: totalCalculatedSpending, isSlow, monthsToGoal, isIncreaseApplied,
      savingsRate: finalTotalSavings / totalIncome, details: calculatedBudget, recommendedRate: finalRecommendedRate
    });
    setNotificationSet(false);
  }, [income, adults, children, hasCar, targetSavingsRate, excludedCategories, customExpenses, addedCategories, travelCourse, childStage, customMajorExpenses]);

  useEffect(() => { if (budget) { calculateBudget(); } }, [excludedCategories, customExpenses, customMajorExpenses, hasCar, addedCategories, calculateBudget]);

  const handleToggleCategory = (minorCat) => { setExcludedCategories(p => p.includes(minorCat) ? p.filter(c => c !== minorCat) : [...p, minorCat]); };
  const handleCustomExpenseChange = (cat, val) => { const num = val.replace(/,/g, '') === '' ? undefined : Number(val.replace(/,/g, '')); if (!isNaN(num) || num === undefined) { setCustomExpenses(p => ({ ...p, [cat]: num })); } };
  const handleCustomMajorExpenseChange = (cat, val) => { const num = val.replace(/,/g, '') === '' ? undefined : Number(val.replace(/,/g, '')); if (!isNaN(num) || num === undefined) { setCustomMajorExpenses(p => ({ ...p, [cat]: num })); } };
  const handleIncomeChange = (e) => { const val = e.target.value.replace(/,/g, ''); if (/^\d*$/.test(val)) { setIncome(val === '' ? 0 : parseInt(val, 10)); } };
  const handleAddCategory = (cat) => { setAddedCategories(p => [...p, cat]); };
  const handleRemoveCategory = (id) => { setAddedCategories(p => p.filter(c => c.id !== id)); };
  const handleReset = () => { setAdults(1); setChildren(0); setChildStage('preschooler'); setIncome(3000000); setHasCar(false); setTargetSavingsRate(0.4); setTravelCourse('파리 집중 (프랑스)'); setExcludedCategories([]); setCustomExpenses({}); setCustomMajorExpenses({}); setAddedCategories([]); setBudget(null); setIsCustomIncome(false); setNotificationSet(false); };
  const applyAggressivePlan = () => {
    const currentRateInfo = savingsRates.find(r => r.value === targetSavingsRate);
    const currentIndex = savingsRates.indexOf(currentRateInfo);
    if (currentIndex < savingsRates.length - 1) {
      const nextRate = savingsRates[currentIndex + 1];
      setTargetSavingsRate(nextRate.value);
    }
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen font-sans p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8"><div className="flex justify-center items-center gap-4 mb-2"><PiggyBank className="w-12 h-12 text-indigo-400" /><h1 className="text-3xl sm:text-4xl font-bold text-slate-100">1억 모으기 챌린지: 가계부 분석기</h1></div><p className="text-slate-400 max-w-2xl mx-auto">당신의 정보에 맞춰 '최소 지출, 최대 저축'을 위한 최적의 예산안을 실시간으로 조정해 드립니다.</p></header>
        <main className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 bg-slate-800 p-6 rounded-2xl shadow-lg h-fit">
            <h2 className="text-xl font-semibold mb-6 text-slate-200 border-b border-slate-700 pb-3">1. 내 정보 입력하기</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-slate-400 mb-2"><IconWrapper icon={Users}>성인</IconWrapper></label><select value={adults} onChange={e => setAdults(Number(e.target.value))} className="w-full bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none">{[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}명</option>)}</select></div>
                <div><label className="block text-sm font-medium text-slate-400 mb-2"><IconWrapper icon={Baby}>자녀</IconWrapper></label><select value={children} onChange={e => setChildren(Number(e.target.value))} className="w-full bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none">{[0, 1, 2, 3, 4].map(n => <option key={n} value={n}>{n}명</option>)}</select></div>
              </div>
              {children > 0 && <div><label className="block text-sm font-medium text-slate-400 mb-2"><IconWrapper icon={GraduationCap}>자녀 생애주기</IconWrapper></label><div className="flex items-center bg-slate-700 rounded-lg p-1"><button onClick={() => setChildStage('preschooler')} className={`w-1/2 p-2 rounded-md text-sm font-semibold transition-all ${childStage === 'preschooler' ? 'bg-indigo-600 text-white' : 'text-slate-300'}`}>미취학 아동</button><button onClick={() => setChildStage('student')} className={`w-1/2 p-2 rounded-md text-sm font-semibold transition-all ${childStage === 'student' ? 'bg-indigo-600 text-white' : 'text-slate-300'}`}>초/중/고등학생</button></div></div>}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2"><IconWrapper icon={DollarSign}>세후 월소득</IconWrapper></label>
                {isCustomIncome ? (<input type="text" value={Number(income).toLocaleString('ko-KR')} onChange={handleIncomeChange} placeholder="월소득(원) 입력" className="w-full bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />) : (<select value={income} onChange={e => {setIncome(Number(e.target.value)); setIsCustomIncome(false);}} className="w-full bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none">{incomeBrackets.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}</select>)}
                <button onClick={() => setIsCustomIncome(!isCustomIncome)} className="text-sm text-indigo-400 hover:text-indigo-300 mt-2">{isCustomIncome ? '구간 선택으로 변경' : '직접 입력으로 변경'}</button>
              </div>
              <div><label className="block text-sm font-medium text-slate-400 mb-2"><IconWrapper icon={Plane}>유럽 여행 코스</IconWrapper></label><select value={travelCourse} onChange={e => setTravelCourse(e.target.value)} className="w-full bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none">{Object.keys(travelCourses).map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              <div><label className="block text-sm font-medium text-slate-400 mb-2"><IconWrapper icon={Car}>차량 보유 여부</IconWrapper></label><div className="flex items-center bg-slate-700 rounded-lg p-1"><button onClick={() => setHasCar(false)} className={`w-1/2 p-2 rounded-md text-sm font-semibold transition-all ${!hasCar ? 'bg-indigo-600 text-white' : 'text-slate-300'}`}>미보유</button><button onClick={() => setHasCar(true)} className={`w-1/2 p-2 rounded-md text-sm font-semibold transition-all ${hasCar ? 'bg-indigo-600 text-white' : 'text-slate-300'}`}>보유</button></div></div>
              <div><label className="block text-sm font-medium text-slate-400 mb-2"><IconWrapper icon={Target}>목표 저축률</IconWrapper></label><div className="grid grid-cols-2 gap-2">{savingsRates.map(rate => <button key={rate.value} onClick={() => setTargetSavingsRate(rate.value)} className={`p-3 rounded-lg text-sm font-semibold transition-all ${targetSavingsRate === rate.value ? 'bg-indigo-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}>{rate.label}</button>)}</div></div>
              <div className="flex flex-col sm:flex-row gap-3 pt-4"><button onClick={calculateBudget} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-transform transform hover:scale-105"><BarChart3 className="w-5 h-5" />예산 계산하기</button><button onClick={handleReset} className="w-full bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-transform transform hover:scale-105"><RefreshCw className="w-5 h-5" />초기화</button></div>
            </div>
          </div>
          <div className="lg:col-span-3">
            {budget ? (<div><div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-semibold mb-6 text-slate-200 border-b border-slate-700 pb-3">2. 추천 예산안</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-center"><div className="bg-slate-700 p-4 rounded-lg"><p className="text-sm text-slate-400">총수입</p><p className="text-2xl font-bold text-slate-100">{formatCurrency(budget.totalIncome)}</p></div><div className="bg-green-800/50 p-4 rounded-lg"><p className="text-sm text-green-300">총 저축액</p><p className="text-2xl font-bold text-green-200">{formatCurrency(budget.totalSavings)}</p><p className="text-xs text-green-400">저축률: {isFinite(budget.savingsRate) ? (budget.savingsRate * 100).toFixed(1) : '0.0'}%</p></div><div className="bg-red-800/50 p-4 rounded-lg"><p className="text-sm text-red-300">총지출</p><p className="text-2xl font-bold text-red-200">{formatCurrency(budget.totalSpending)}</p></div></div>
                <div className="bg-slate-700/50 rounded-lg p-4 mb-6 text-sm text-slate-300 space-y-2"><div className="flex justify-between"><span>- 1억 모으기 저축:</span><span className="font-semibold text-slate-100">{formatCurrency(budget.mainGoalSavings)}</span></div><div className="flex justify-between"><span>- 유럽여행 저축:</span><span className="font-semibold text-slate-100">{formatCurrency(budget.travelSavings)}</span></div></div>
                {targetSavingsRate === 0.4 && <div className="bg-indigo-900/50 text-indigo-200 p-4 rounded-lg mb-6 text-center text-sm">현재 조건에 맞는 추천 저축률은 <strong>{(budget.recommendedRate * 100).toFixed(1)}%</strong> 입니다.</div>}
                {budget.isSlow && <div className="bg-red-900/50 text-red-200 p-4 rounded-lg mb-6 text-center "><p className="mb-2">🚨 1억 달성까지 10년 이상 소요됩니다. 더 강력한 짠테크 플랜을 적용해볼까요?</p><button onClick={applyAggressivePlan} className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 w-full"><ChevronsUp className="w-5 h-5" />저축률 상향 조정하기</button></div>}
                <div className="bg-amber-800/50 text-amber-200 p-4 rounded-lg mb-6 text-center flex items-center gap-3"><Gift className="w-8 h-8 flex-shrink-0 text-amber-400" /><div><strong>축하합니다!</strong> 1억 달성과 동시에, <strong className="text-amber-300">{formatCurrency(budget.totalTravelCost)} 상당의 유럽 여행</strong>이라는 멋진 선물이 기다립니다!</div></div>
                <div className="space-y-8">
                  <SavingsTable mainGoalSavings={budget.mainGoalSavings} travelSavings={budget.travelSavings} totalTravelCost={budget.totalTravelCost} isIncreaseApplied={budget.isIncreaseApplied} monthsToGoal={budget.monthsToGoal} />
                  <TravelPlanner adults={adults} children={children} course={travelCourse} onNotify={() => setNotificationSet(true)} notificationSet={notificationSet} />
                </div>
                <div className="space-y-6 mt-8">{Object.entries(budget.details).map(([majorCat, data]) => {
                    if (majorCat.includes('미취학') && (children === 0 || childStage !== 'preschooler')) return null;
                    if (majorCat.includes('학생') && (children === 0 || childStage !== 'student')) return null;
                    const hasVisibleItems = Object.values(data.items).length > 0;
                    if (!hasVisibleItems) return null;
                    return (<div key={majorCat}>
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-lg font-semibold text-indigo-400">{majorCat.replace(/ \(.+\)/, '')}</h3>
                          <div className="flex items-center gap-2">
                            <input type="text" value={(customMajorExpenses[majorCat] || customMajorExpenses[majorCat] === 0) ? (Number(customMajorExpenses[majorCat])).toLocaleString('ko-KR') : ''} onChange={(e) => handleCustomMajorExpenseChange(majorCat, e.target.value)} placeholder={formatNumber(data.total)} className="bg-slate-600 text-right text-white font-semibold rounded-md p-1 w-28 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /><span>원</span>
                          </div>
                        </div>
                        <div className="space-y-2 pl-4 border-l-2 border-slate-700">
                            {Object.entries(data.items).map(([minorCat, itemData]) => {
                                const isExcluded = excludedCategories.includes(minorCat);
                                const placeholderAmount = budget.details[majorCat]?.items[minorCat]?.amount || 0;
                                return (<div key={minorCat} className="bg-slate-700/50 p-3 rounded-lg">
                                    <div className="flex justify-between items-center flex-wrap gap-2">
                                        <div className="flex items-center gap-3">
                                            {itemData.isAdded ? <button onClick={() => handleRemoveCategory(itemData.id)} title="항목 삭제" className="p-1 rounded-full hover:bg-slate-600"><X className="w-4 h-4 text-red-400"/></button> : (minorCat !== '주거비' && <button onClick={() => handleToggleCategory(minorCat)} title={isExcluded ? "항목 포함" : "항목 제외"} className="p-1 rounded-full hover:bg-slate-600"><Trash2 className={`w-4 h-4 ${isExcluded ? 'text-red-400' : 'text-slate-500'}`}/></button>)}
                                            <span className={`font-medium ${isExcluded ? 'line-through text-slate-500' : 'text-slate-200'}`}>{minorCat.replace(' (자녀)', '')}</span>
                                        </div>
                                        {itemData.type === 'fixed' || itemData.type === 'variable' ? (<div className="flex items-center gap-2"><input type="text" value={(customExpenses[minorCat] || customExpenses[minorCat] === 0) ? (Number(customExpenses[minorCat])).toLocaleString('ko-KR') : ''} onChange={(e) => handleCustomExpenseChange(minorCat, e.target.value)} placeholder={formatNumber(placeholderAmount)} className="bg-slate-600 text-right text-white font-semibold rounded-md p-1 w-28 focus:ring-2 focus:ring-indigo-500 focus:outline-none" /><span>원</span></div>) : (<span className={`font-semibold ${isExcluded ? 'line-through text-slate-500' : 'text-slate-100'}`}>{formatCurrency(itemData.amount)}</span>)}
                                    </div>
                                    {!isExcluded && !itemData.isAdded && (<div className="pl-8 mt-2 space-y-1 text-sm">{Object.entries(itemData.sub).map(([subCat, subAmount]) => {if (!hasCar && subCat === '차량유지비') return null; return (<div key={subCat} className="flex justify-between text-slate-400"><span>- {subCat}</span><span>{formatCurrency(subAmount)}</span></div>)})}</div>)}
                                </div>)
                            })}
                            {majorCat === '고정지출' && <AddCategoryForm type="fixed" onAdd={handleAddCategory} />}
                            {majorCat.includes('생활비') && <AddCategoryForm type="variable" onAdd={handleAddCategory} />}
                        </div>
                    </div>)
                })}
                <JjantechTipsComponent adults={adults} children={children} />
                </div>
            </div></div>) : (<div className="bg-slate-800 p-6 rounded-2xl shadow-lg h-full flex flex-col justify-center items-center text-center"><BarChart3 className="w-16 h-16 text-slate-600 mb-4" /><h2 className="text-xl font-semibold text-slate-300">결과를 기다리고 있어요</h2><p className="text-slate-400 mt-2">왼쪽에서 정보를 입력하고 '예산 계산하기' 버튼을 눌러주세요.</p></div>)}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;

