// 사용자 관리 시스템
const userSystem = {
  currentUser: null,
  
  // 로그인
  login(email, password) {
    const users = JSON.parse(localStorage.getItem('sigolfriend_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      this.currentUser = user;
      localStorage.setItem('sigolfriend_current_user', JSON.stringify(user));
      this.updateUI();
      return { success: true, user };
    }
    return { success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' };
  },
  
  // 회원가입
  signup(userData) {
    const users = JSON.parse(localStorage.getItem('sigolfriend_users') || '[]');
    
    // 이메일 중복 체크
    if (users.find(u => u.email === userData.email)) {
      return { success: false, message: '이미 등록된 이메일입니다.' };
    }
    
    // 사용자 ID 생성
    userData.id = Date.now().toString();
    userData.createdAt = new Date().toISOString();
    
    users.push(userData);
    localStorage.setItem('sigolfriend_users', JSON.stringify(users));
    
    return { success: true, message: '회원가입이 완료되었습니다.' };
  },
  
  // 로그아웃
  logout() {
    this.currentUser = null;
    localStorage.removeItem('sigolfriend_current_user');
    this.updateUI();
    location.reload();
  },
  
  // 현재 사용자 정보 로드
  loadCurrentUser() {
    const user = localStorage.getItem('sigolfriend_current_user');
    if (user) {
      this.currentUser = JSON.parse(user);
      this.updateUI();
    }
  },
  
  // UI 업데이트
  updateUI() {
    const loginBtn = document.querySelector('a[onclick="showLoginModal()"]');
    const signupBtn = document.querySelector('.nav-link.btn.btn-primary');
    
    if (this.currentUser && loginBtn) {
      // 로그인 상태 - 사용자 메뉴 표시
      const userMenu = this.createUserMenu();
      loginBtn.parentElement.innerHTML = userMenu;
    } else if (loginBtn) {
      // 로그아웃 상태 - 로그인 버튼 표시
      loginBtn.innerHTML = '로그인';
      loginBtn.onclick = showLoginModal;
    }
  },
  
  // 사용자 메뉴 생성
  createUserMenu() {
    const user = this.currentUser;
    const initial = user.name.charAt(0).toUpperCase();
    const userTypeText = {
      'parent': '학부모',
      'coordinator': '코디네이터', 
      'admin': '교육청'
    }[user.userType] || '사용자';
    
    return `
      <div class="user-menu">
        <div class="user-profile show" onclick="toggleUserDropdown()">
          <div class="user-avatar">${initial}</div>
          <span class="d-none d-md-inline">${user.name}</span>
          <i class="fas fa-chevron-down ms-1"></i>
        </div>
        <div class="user-dropdown" id="userDropdown">
          <a href="#" onclick="showDashboard()">
            <i class="fas fa-tachometer-alt me-2"></i>대시보드
          </a>
          <a href="#" onclick="showProfile()">
            <i class="fas fa-user me-2"></i>프로필
          </a>
          <a href="#" onclick="userSystem.logout()">
            <i class="fas fa-sign-out-alt me-2"></i>로그아웃
          </a>
        </div>
      </div>
    `;
  }
};

// AI 매칭 시스템 데이터
const matchingData = {
  interests: [
    { id: "nature", name: "자연 체험", weight: 25 },
    { id: "agriculture", name: "농업 활동", weight: 20 },
    { id: "culture", name: "전통 문화", weight: 15 },
    { id: "ecology", name: "생태 학습", weight: 20 },
    { id: "sports", name: "야외 스포츠", weight: 10 },
    { id: "art", name: "예술/공예", weight: 10 },
  ],
  environments: [
    { id: "mountain", name: "산", regions: ["강원도 평창군", "전라북도 전주시"] },
    { id: "sea", name: "바다", regions: ["강원도 평창군", "전라남도 순천시"] },
    { id: "field", name: "들판", regions: ["전라남도 순천시", "전라북도 전주시"] },
    { id: "river", name: "강/호수", regions: ["강원도 평창군", "전라북도 전주시"] },
  ],
  regions: {
    "강원도 평창군": {
      scores: {
        nature: 95,
        ecology: 90,
        sports: 85,
        agriculture: 70,
        culture: 75,
        art: 60,
      },
      features: ["생태체험", "등산/트레킹", "해양스포츠"],
      schools: 15,
      capacity: 120,
      cost: 800000,
      description: "산과 바다가 어우러진 자연 속에서 생태 감수성을 기르는 교육",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      schoolSize: "소규모 (평균 45명)",
      mainSchool: "평창초등학교"
    },
    "전라남도 순천시": {
      scores: {
        agriculture: 95,
        nature: 85,
        culture: 80,
        ecology: 75,
        sports: 70,
        art: 65,
      },
      features: ["농업체험", "전통문화", "갯벌체험"],
      schools: 18,
      capacity: 140,
      cost: 750000,
      description: "농업 체험과 전통 문화가 살아있는 남도의 정취를 만끽",
      image: "https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      schoolSize: "중규모 (평균 78명)",
      mainSchool: "순천만초등학교"
    },
    "전라북도 전주시": {
      scores: {
        culture: 95,
        art: 90,
        nature: 75,
        agriculture: 70,
        ecology: 65,
        sports: 60,
      },
      features: ["전통예술", "한옥체험", "공예활동"],
      schools: 12,
      capacity: 92,
      cost: 780000,
      description: "한옥마을과 전통 예술이 어우러진 문화 체험 중심 교육",
      image: "https://images.unsplash.com/photo-1564415637254-92c66292cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      schoolSize: "소규모 (평균 52명)",
      mainSchool: "전주한옥마을초등학교"
    },
  },
};

// 전역 변수
let currentStep = 1;
let userResponses = {};
let matchingResults = [];

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", function () {
  initializeAnimations();
  setupEventListeners();
});

// 애니메이션 초기화
function initializeAnimations() {
  // 스크롤 애니메이션
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  // 애니메이션 대상 요소들
  document
    .querySelectorAll(".feature-card, .region-card, .stat-item")
    .forEach((el) => {
      el.classList.add("fade-in");
      observer.observe(el);
    });
}

// 이벤트 리스너 설정
function setupEventListeners() {
  // 부드러운 스크롤
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // 네비게이션 배경 변경
  window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 100) {
      navbar.style.backgroundColor = "rgba(255, 255, 255, 0.98)";
    } else {
      navbar.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
    }
  });
}

// AI 매칭 시작
function startMatching() {
  currentStep = 1;
  userResponses = {};
  showMatchingModal();
}

// 매칭 모달 표시
function showMatchingModal() {
  const modal = new bootstrap.Modal(document.getElementById("matchingModal"));
  loadMatchingStep(currentStep);
  modal.show();
}

// 매칭 단계 로드
function loadMatchingStep(step) {
  const content = document.getElementById("matchingContent");

  switch (step) {
    case 1:
      content.innerHTML = getStep1Content();
      break;
    case 2:
      content.innerHTML = getStep2Content();
      break;
    case 3:
      content.innerHTML = getStep3Content();
      break;
    case 4:
      content.innerHTML = getStep4Content();
      break;
    case 5:
      content.innerHTML = getStep5Content();
      break;
    case 6:
      calculateMatching();
      content.innerHTML = getResultsContent();
      break;
  }
}

// 1단계: 기본 정보
function getStep1Content() {
  return `
        <div class="matching-step">
            <div class="step-header mb-4">
                <div class="progress mb-3">
                    <div class="progress-bar bg-primary" style="width: 20%"></div>
                </div>
                <h4>기본 정보를 알려주세요</h4>
                <p class="text-muted">아이의 기본 정보를 입력해주세요.</p>
            </div>
            
            <form id="step1Form">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label">학생 이름</label>
                        <input type="text" class="form-control" id="studentName" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">학년</label>
                        <select class="form-control" id="grade" required>
                            <option value="">선택하세요</option>
                            <option value="1">1학년</option>
                            <option value="2">2학년</option>
                            <option value="3">3학년</option>
                            <option value="4">4학년</option>
                            <option value="5">5학년</option>
                            <option value="6">6학년</option>
                        </select>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label">성별</label>
                        <select class="form-control" id="gender" required>
                            <option value="">선택하세요</option>
                            <option value="male">남성</option>
                            <option value="female">여성</option>
                            <option value="none">선택안함</option>
                        </select>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">희망 기간</label>
                        <select class="form-control" id="duration" required>
                            <option value="">선택하세요</option>
                            <option value="short">단기 (1~3개월)</option>
                            <option value="1semester">1학기 (6개월)</option>
                            <option value="1year">1년</option>
                            <option value="2years">2년 이상</option>
                        </select>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label">월 예산 (만원)</label>
                        <select class="form-control" id="budget" required>
                            <option value="">선택하세요</option>
                            <option value="50-70">50-70만원</option>
                            <option value="70-90">70-90만원</option>
                            <option value="90+">90만원 이상</option>
                        </select>
                    </div>
                </div>
                
                <div class="text-end">
                    <button type="button" class="btn btn-primary" onclick="nextStep()">다음 단계</button>
                </div>
            </form>
        </div>
    `;
}

// 2단계: 관심사 선택
function getStep2Content() {
  return `
        <div class="matching-step">
            <div class="step-header mb-4">
                <div class="progress mb-3">
                    <div class="progress-bar bg-primary" style="width: 33%"></div>
                </div>
                <h4>아이의 관심 분야를 선택해주세요</h4>
                <p class="text-muted">중요도가 높은 순서로 3개를 선택해주세요.</p>
            </div>
            
            <div class="interests-grid row g-3" id="interestsGrid">
                ${matchingData.interests
                  .map(
                    (interest) => `
                    <div class="col-md-4 col-6">
                        <div class="interest-card card border text-center h-100" data-interest="${
                          interest.id
                        }" onclick="selectInterest('${interest.id}')">
                            <div class="card-body p-3">
                                <div class="interest-icon mb-2">
                                    <i class="fas ${getInterestIcon(
                                      interest.id
                                    )} fa-2x text-muted"></i>
                                </div>
                                <h6 class="card-title">${interest.name}</h6>
                                <div class="selected-badge d-none">
                                    <span class="badge bg-primary">선택됨</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `
                  )
                  .join("")}
            </div>
            
            <div class="selected-interests mt-4" id="selectedInterests">
                <h6>선택된 관심사 (우선순위):</h6>
                <div class="selected-list" id="selectedList"></div>
            </div>
            
            <div class="d-flex justify-content-between mt-4">
                <button type="button" class="btn btn-outline-secondary" onclick="prevStep()">이전</button>
                <button type="button" class="btn btn-primary" onclick="nextStep()" id="step2Next" disabled>다음 단계</button>
            </div>
        </div>
    `;
}

// 3단계: 환경 선호도
function getStep3Content() {
  return `
        <div class="matching-step">
            <div class="step-header mb-4">
                <div class="progress mb-3">
                    <div class="progress-bar bg-primary" style="width: 50%"></div>
                </div>
                <h4>선호하는 환경을 알려주세요</h4>
                <p class="text-muted">아이가 좋아하는 자연 환경의 중요도를 설정해주세요.</p>
            </div>
            
            <div class="environment-preferences">
                ${matchingData.environments
                  .map(
                    (env) => `
                    <div class="mb-4">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <label class="form-label fw-bold">
                                <i class="fas ${getEnvironmentIcon(
                                  env.id
                                )} me-2 text-primary"></i>
                                ${env.name}
                            </label>
                            <span class="preference-value fw-bold text-primary" id="value-${
                              env.id
                            }">50%</span>
                        </div>
                        <input type="range" class="form-range" min="0" max="100" value="50" 
                               id="pref-${env.id}" data-env="${env.id}" 
                               oninput="updatePreferenceValue('${
                                 env.id
                               }', this.value)">
                    </div>
                `
                  )
                  .join("")}
            </div>
            
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                각 환경의 중요도를 0-100% 사이에서 조절해주세요. 총합이 100%가 될 필요는 없습니다.
            </div>
            
            <div class="d-flex justify-content-between">
                <button type="button" class="btn btn-outline-secondary" onclick="prevStep()">이전</button>
                <button type="button" class="btn btn-primary" onclick="nextStep()">다음 단계</button>
            </div>
        </div>
    `;
}

// 4단계: 추가 선호사항
function getStep4Content() {
  return `
        <div class="matching-step">
            <div class="step-header mb-4">
                <div class="progress mb-3">
                    <div class="progress-bar bg-primary" style="width: 67%"></div>
                </div>
                <h4>추가 선호사항을 알려주세요</h4>
                <p class="text-muted">더 정확한 매칭을 위한 추가 정보입니다.</p>
            </div>
            
            <form id="step4Form">
                <div class="mb-4">
                    <label class="form-label">학교 규모 선호도</label>
                    <div class="row g-3">
                        <div class="col-md-4">
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="schoolSize" value="small" id="schoolSmall">
                                <label class="form-check-label" for="schoolSmall">
                                    <strong>소규모</strong><br>
                                    <small class="text-muted">전교생 50명 이하</small>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="schoolSize" value="medium" id="schoolMedium">
                                <label class="form-check-label" for="schoolMedium">
                                    <strong>중규모</strong><br>
                                    <small class="text-muted">전교생 50-150명</small>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="schoolSize" value="any" id="schoolAny" checked>
                                <label class="form-check-label" for="schoolAny">
                                    <strong>상관없음</strong><br>
                                    <small class="text-muted">규모 무관</small>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="mb-4">
                    <label class="form-label">도시 접근성</label>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="accessibility" value="high" id="accessHigh">
                                <label class="form-check-label" for="accessHigh">
                                    <strong>높음</strong><br>
                                    <small class="text-muted">도시까지 1시간 이내</small>
                                </label>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="accessibility" value="any" id="accessAny" checked>
                                <label class="form-check-label" for="accessAny">
                                    <strong>상관없음</strong><br>
                                    <small class="text-muted">거리 무관</small>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="mb-4">
                    <label class="form-label">특별 요청사항</label>
                    <textarea class="form-control" rows="3" id="specialRequests" 
                              placeholder="특별히 고려해야 할 사항이나 요청사항을 적어주세요. (선택사항)"></textarea>
                </div>
            </form>
            
            <div class="d-flex justify-content-between">
                <button type="button" class="btn btn-outline-secondary" onclick="prevStep()">이전</button>
                <button type="button" class="btn btn-primary" onclick="nextStep()">다음 단계</button>
            </div>
        </div>
    `;
}

// 5단계: 성향 테스트
function getStep5Content() {
  return `
        <div class="matching-step">
            <div class="step-header mb-4">
                <div class="progress mb-3">
                    <div class="progress-bar bg-primary" style="width: 83%"></div>
                </div>
                <h4>성향 테스트</h4>
                <p class="text-muted">아이의 성격과 활동 선호도를 파악하기 위한 질문입니다.</p>
            </div>
            
            <form id="step5Form">
                <div class="personality-test">
                    <div class="mb-4">
                        <h6 class="fw-bold mb-3">어떤 성향인가요?</h6>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <div class="personality-option card border h-100" data-category="social" data-value="extrovert" onclick="selectPersonality('social', 'extrovert', this)">
                                    <div class="card-body text-center p-3">
                                        <i class="fas fa-users text-primary fa-2x mb-2"></i>
                                        <h6 class="fw-bold">활발하고 외향적</h6>
                                        <small class="text-muted">새로운 사람들과 쉽게 친해지고 활발한 활동을 좋아함</small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="personality-option card border h-100" data-category="social" data-value="introvert" onclick="selectPersonality('social', 'introvert', this)">
                                    <div class="card-body text-center p-3">
                                        <i class="fas fa-book text-success fa-2x mb-2"></i>
                                        <h6 class="fw-bold">조용하고 내향적</h6>
                                        <small class="text-muted">깊이 생각하고 차분한 활동을 선호함</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row g-3 mt-2">
                            <div class="col-12">
                                <div class="personality-option card border" data-category="social" data-value="balanced" onclick="selectPersonality('social', 'balanced', this)">
                                    <div class="card-body text-center p-3">
                                        <i class="fas fa-balance-scale text-warning fa-2x mb-2"></i>
                                        <h6 class="fw-bold">상황에 따라 다름</h6>
                                        <small class="text-muted">때로는 활발하고 때로는 조용함</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mb-4">
                        <h6 class="fw-bold mb-3">어떤 활동을 선호하나요?</h6>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <div class="personality-option card border h-100" data-category="activity" data-value="group" onclick="selectPersonality('activity', 'group', this)">
                                    <div class="card-body text-center p-3">
                                        <i class="fas fa-user-friends text-primary fa-2x mb-2"></i>
                                        <h6 class="fw-bold">단체 활동</h6>
                                        <small class="text-muted">여러 명이 함께하는 활동을 좋아함</small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="personality-option card border h-100" data-category="activity" data-value="individual" onclick="selectPersonality('activity', 'individual', this)">
                                    <div class="card-body text-center p-3">
                                        <i class="fas fa-user text-success fa-2x mb-2"></i>
                                        <h6 class="fw-bold">개인 활동</h6>
                                        <small class="text-muted">혼자 집중할 수 있는 활동을 선호함</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row g-3 mt-2">
                            <div class="col-12">
                                <div class="personality-option card border" data-category="activity" data-value="small" onclick="selectPersonality('activity', 'small', this)">
                                    <div class="card-body text-center p-3">
                                        <i class="fas fa-user-plus text-warning fa-2x mb-2"></i>
                                        <h6 class="fw-bold">소그룹 활동</h6>
                                        <small class="text-muted">2-3명의 소수와 함께하는 활동을 좋아함</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mb-4">
                        <h6 class="fw-bold mb-3">새로운 환경에 대한 적응은?</h6>
                        <div class="row g-3">
                            <div class="col-md-4">
                                <div class="personality-option card border h-100" data-category="adaptation" data-value="quick" onclick="selectPersonality('adaptation', 'quick', this)">
                                    <div class="card-body text-center p-3">
                                        <i class="fas fa-rocket text-primary fa-2x mb-2"></i>
                                        <h6 class="fw-bold">빠른 적응</h6>
                                        <small class="text-muted">새로운 환경에 금방 적응함</small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="personality-option card border h-100" data-category="adaptation" data-value="gradual" onclick="selectPersonality('adaptation', 'gradual', this)">
                                    <div class="card-body text-center p-3">
                                        <i class="fas fa-clock text-warning fa-2x mb-2"></i>
                                        <h6 class="fw-bold">점진적 적응</h6>
                                        <small class="text-muted">시간을 두고 천천히 적응함</small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="personality-option card border h-100" data-category="adaptation" data-value="careful" onclick="selectPersonality('adaptation', 'careful', this)">
                                    <div class="card-body text-center p-3">
                                        <i class="fas fa-shield-alt text-success fa-2x mb-2"></i>
                                        <h6 class="fw-bold">신중한 적응</h6>
                                        <small class="text-muted">충분히 관찰한 후 적응함</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mb-4">
                        <h6 class="fw-bold mb-3">스트레스 해소 방법은?</h6>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <div class="personality-option card border h-100" data-category="stress" data-value="active" onclick="selectPersonality('stress', 'active', this)">
                                    <div class="card-body text-center p-3">
                                        <i class="fas fa-running text-primary fa-2x mb-2"></i>
                                        <h6 class="fw-bold">활동적 해소</h6>
                                        <small class="text-muted">몸을 움직이는 활동으로 스트레스 해소</small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="personality-option card border h-100" data-category="stress" data-value="calm" onclick="selectPersonality('stress', 'calm', this)">
                                    <div class="card-body text-center p-3">
                                        <i class="fas fa-leaf text-success fa-2x mb-2"></i>
                                        <h6 class="fw-bold">정적 해소</h6>
                                        <small class="text-muted">조용한 활동으로 마음을 달램</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="selected-personality mt-4" id="selectedPersonality">
                    <div class="alert alert-light border">
                        <h6 class="fw-bold mb-2"><i class="fas fa-user-check me-2"></i>선택된 성향</h6>
                        <div id="personalityDisplay">각 질문에 답변하시면 여기에 표시됩니다.</div>
                    </div>
                </div>
            </form>
            
            <div class="d-flex justify-content-between">
                <button type="button" class="btn btn-outline-secondary" onclick="prevStep()">이전</button>
                <button type="button" class="btn btn-primary" onclick="nextStep()" id="step5Next" disabled>
                    <i class="fas fa-magic me-2"></i>AI 매칭 시작
                </button>
            </div>
        </div>
    `;
}

// 결과 페이지
function getResultsContent() {
  return `
        <div class="matching-results">
            <div class="step-header mb-4 text-center">
                <div class="progress mb-3">
                    <div class="progress-bar bg-success" style="width: 100%"></div>
                </div>
                <h4><i class="fas fa-check-circle text-success me-2"></i>AI 매칭 완료!</h4>
                <p class="text-muted">분석 결과 가장 적합한 농촌유학 지역 TOP 3를 추천드립니다.

</p>
            </div>
            
            <div class="results-grid">
                ${matchingResults
                  .map(
                    (result, index) => `
                    <div class="result-card card border-0 shadow-sm mb-4">
                        <div class="row g-0">
                            <div class="col-md-4 position-relative">
                                <img src="${result.image}" class="img-fluid rounded-start h-100" style="object-fit: cover;" alt="${result.region}">
                                <button class="favorite-btn position-absolute" 
                                        onclick="toggleFavorite('${result.region}', ${index})" 
                                        id="fav-btn-${index}"
                                        title="관심지역에 추가">
                                    <i class="fas fa-heart" id="fav-icon-${index}"></i>
                                </button>
                            </div>
                            <div class="col-md-8">
                                <div class="card-body h-100 d-flex flex-column">
                                    <div class="d-flex justify-content-between align-items-start mb-2">
                                        <div class="flex-grow-1">
                                            <div class="d-flex align-items-center mb-2">
                                                <span class="rank-badge badge bg-${getRegionColor(result.region)} me-2">
                                                    #${index + 1}
                                                </span>
                                                <h5 class="fw-bold text-${getRegionColor(result.region)} mb-0">
                                                    ${result.region}
                                                </h5>
                                            </div>
                                            <div class="match-score mb-2">
                                                <span class="badge bg-${getRegionColor(result.region)} fs-6">${result.score}% 일치</span>
                                                <small class="text-muted ms-2">${result.schoolSize}</small>
                                            </div>
                                        </div>
                                        <div class="region-info text-end">
                                            <small class="text-muted">월 평균 비용</small><br>
                                            <strong class="text-${getRegionColor(result.region)}">${(result.cost / 10000).toFixed(0)}만원</strong>
                                        </div>
                                    </div>
                            
                                    <p class="text-muted mb-3">${result.description}</p>
                                    
                                    <div class="features mb-3">
                                        ${result.features
                                          .map(
                                            (feature) =>
                                              `<span class="badge bg-light text-dark border me-1 mb-1">${feature}</span>`
                                          )
                                          .join("")}
                                    </div>
                                    
                                    <div class="row text-center mb-3">
                                        <div class="col-3">
                                            <small class="text-muted">참여학교</small><br>
                                            <strong>${result.schools}개교</strong>
                                        </div>
                                        <div class="col-3">
                                            <small class="text-muted">수용인원</small><br>
                                            <strong>${result.capacity}명</strong>
                                        </div>
                                        <div class="col-3">
                                            <small class="text-muted">대표학교</small><br>
                                            <strong>${result.mainSchool}</strong>
                                        </div>
                                        <div class="col-3">
                                            <small class="text-muted">매칭도</small><br>
                                            <div class="progress mt-1" style="height: 6px;">
                                                <div class="progress-bar bg-${getRegionColor(
                                                  result.region
                                                )}" 
                                                     style="width: ${
                                                       result.score
                                                     }%"></div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="mt-auto">
                                        <button class="btn btn-outline-${getRegionColor(
                                          result.region
                                        )} btn-sm me-2" 
                                                onclick="showRegionDetail('${
                                                  result.region
                                                }')">
                                            <i class="fas fa-info-circle me-1"></i>자세히 보기
                                        </button>
                                        <button class="btn btn-${getRegionColor(
                                          result.region
                                        )} btn-sm" 
                                                onclick="applyToRegion('${
                                                  result.region
                                                }')">
                                            <i class="fas fa-paper-plane me-1"></i>신청하기
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `
                  )
                  .join("")}
            </div>
            
            <div class="text-center mt-4">
                <button class="btn btn-outline-primary me-2" onclick="restartMatching()">
                    <i class="fas fa-redo me-2"></i>다시 매칭하기
                </button>
                <button class="btn btn-outline-danger me-2" onclick="showFavoriteRegions()">
                    <i class="fas fa-heart me-2"></i>관심지역 보기 (${favoriteRegions.length})
                </button>
                <button class="btn btn-success" onclick="saveResults()">
                    <i class="fas fa-save me-2"></i>결과 저장하기
                </button>
            </div>
        </div>
    `;
}

// 결과 표시 후 기존 관심지역 상태 업데이트 (현재 사용 안함)
// function updateExistingFavorites() {
//     matchingResults.forEach((result, index) => {
//         if (favoriteRegions.includes(result.region)) {
//             updateFavoriteButton(result.region, index);
//         }
//     });
// }

// 유틸리티 함수들
function getInterestIcon(interestId) {
  const icons = {
    nature: "fa-leaf",
    agriculture: "fa-seedling",
    culture: "fa-landmark",
    ecology: "fa-tree",
    sports: "fa-running",
    art: "fa-palette",
  };
  return icons[interestId] || "fa-star";
}

function getEnvironmentIcon(envId) {
  const icons = {
    mountain: "fa-mountain",
    sea: "fa-water",
    field: "fa-wheat-awn",
    river: "fa-water",
  };
  return icons[envId] || "fa-map-marker-alt";
}

function getRegionColor(region) {
  const colors = {
    "강원도 평창군": "primary",
    "전라남도 순천시": "success", 
    "전라북도 전주시": "warning",
  };
  return colors[region] || "secondary";
}

// 관심사 선택
let selectedInterests = [];

// 성향 테스트
let personalityAnswers = {};

// 관심지역 담기
let favoriteRegions = JSON.parse(localStorage.getItem('favoriteRegions') || '[]');

function selectInterest(interestId) {
  const card = document.querySelector(`[data-interest="${interestId}"]`);
  const badge = card.querySelector(".selected-badge");

  if (selectedInterests.includes(interestId)) {
    // 이미 선택된 경우 제거
    selectedInterests = selectedInterests.filter((id) => id !== interestId);
    card.classList.remove("border-primary", "bg-light");
    badge.classList.add("d-none");
  } else if (selectedInterests.length < 3) {
    // 새로 선택 (최대 3개)
    selectedInterests.push(interestId);
    card.classList.add("border-primary", "bg-light");
    badge.classList.remove("d-none");
  } else {
    // 이미 3개 선택된 경우
    alert("최대 3개까지만 선택할 수 있습니다.");
    return;
  }

  updateSelectedInterestsList();
  updateStep2Button();
}

function updateSelectedInterestsList() {
  const listElement = document.getElementById("selectedList");
  if (selectedInterests.length === 0) {
    listElement.innerHTML =
      '<p class="text-muted">선택된 관심사가 없습니다.</p>';
  } else {
    listElement.innerHTML = selectedInterests
      .map((id, index) => {
        const interest = matchingData.interests.find((i) => i.id === id);
        return `<span class="badge bg-primary me-2">${index + 1}순위: ${
          interest.name
        }</span>`;
      })
      .join("");
  }
}

function updateStep2Button() {
  const button = document.getElementById("step2Next");
  button.disabled = selectedInterests.length === 0;
}

// 환경 선호도 업데이트
function updatePreferenceValue(envId, value) {
  document.getElementById(`value-${envId}`).textContent = value + "%";
}

// 성향 선택
function selectPersonality(category, value, element) {
  // 같은 카테고리의 다른 선택 해제
  document.querySelectorAll(`[data-category="${category}"]`).forEach((card) => {
    card.classList.remove("border-primary", "bg-light");
    card.style.transform = "";
  });

  // 현재 선택 활성화
  element.classList.add("border-primary", "bg-light");
  element.style.transform = "scale(1.02)";

  // 답변 저장
  personalityAnswers[category] = value;

  // 선택된 성향 표시 업데이트
  updatePersonalityDisplay();

  // 모든 질문에 답했는지 확인
  checkPersonalityComplete();
}

function updatePersonalityDisplay() {
  const display = document.getElementById("personalityDisplay");
  if (Object.keys(personalityAnswers).length === 0) {
    display.innerHTML = "각 질문에 답변하시면 여기에 표시됩니다.";
    return;
  }

  const personalityLabels = {
    social: {
      extrovert: "외향적",
      introvert: "내향적",
      balanced: "균형잡힌",
    },
    activity: {
      group: "단체활동 선호",
      individual: "개인활동 선호",
      small: "소그룹 선호",
    },
    adaptation: {
      quick: "빠른 적응형",
      gradual: "점진적 적응형",
      careful: "신중한 적응형",
    },
    stress: {
      active: "활동적 해소형",
      calm: "정적 해소형",
    },
  };

  let html = '<div class="d-flex flex-wrap gap-2">';
  Object.keys(personalityAnswers).forEach((category) => {
    const value = personalityAnswers[category];
    const label = personalityLabels[category][value];
    html += `<span class="badge bg-primary">${label}</span>`;
  });
  html += "</div>";

  display.innerHTML = html;
}

function checkPersonalityComplete() {
  const requiredCategories = ["social", "activity", "adaptation", "stress"];
  const completed = requiredCategories.every((cat) => personalityAnswers[cat]);

  const button = document.getElementById("step5Next");
  if (button) {
    button.disabled = !completed;
  }
}

// 단계 이동
function nextStep() {
  // 현재 단계 데이터 저장
  saveCurrentStepData();

  if (currentStep < 6) {
    currentStep++;
    loadMatchingStep(currentStep);
  }
}

function prevStep() {
  if (currentStep > 1) {
    currentStep--;
    loadMatchingStep(currentStep);
  }
}

// 현재 단계 데이터 저장
function saveCurrentStepData() {
  switch (currentStep) {
    case 1:
      userResponses.basic = {
        name: document.getElementById("studentName")?.value,
        grade: document.getElementById("grade")?.value,
        gender: document.getElementById("gender")?.value,
        duration: document.getElementById("duration")?.value,
        budget: document.getElementById("budget")?.value,
      };
      break;
    case 2:
      userResponses.interests = selectedInterests;
      break;
    case 3:
      const envPrefs = {};
      matchingData.environments.forEach((env) => {
        const value = document.getElementById(`pref-${env.id}`)?.value;
        envPrefs[env.id] = parseInt(value || 50);
      });
      userResponses.environments = envPrefs;
      break;
    case 4:
      userResponses.preferences = {
        schoolSize: document.querySelector('input[name="schoolSize"]:checked')
          ?.value,
        accessibility: document.querySelector(
          'input[name="accessibility"]:checked'
        )?.value,
        specialRequests: document.getElementById("specialRequests")?.value,
      };
      break;
    case 5:
      userResponses.personality = personalityAnswers;
      break;
  }
}

// AI 매칭 계산
function calculateMatching() {
  matchingResults = [];

  Object.keys(matchingData.regions).forEach((regionName) => {
    const region = matchingData.regions[regionName];
    let totalScore = 0;
    let maxScore = 0;

    // 관심사 점수 계산
    if (userResponses.interests) {
      userResponses.interests.forEach((interestId, index) => {
        const weight = (3 - index) * 10; // 1순위:30, 2순위:20, 3순위:10
        const score = region.scores[interestId] || 50;
        totalScore += (score * weight) / 100;
        maxScore += weight;
      });
    }

    // 환경 선호도 점수 계산
    if (userResponses.environments) {
      Object.keys(userResponses.environments).forEach((envId) => {
        const preference = userResponses.environments[envId];
        const environment = matchingData.environments.find(
          (e) => e.id === envId
        );
        if (environment && environment.regions.includes(regionName)) {
          totalScore += preference * 0.3; // 환경 점수 가중치
          maxScore += 30;
        }
      });
    }

    // 예산 매칭
    if (userResponses.basic && userResponses.basic.budget) {
      const budget = userResponses.basic.budget;
      const duration = userResponses.basic.duration;
      let budgetMatch = 0;

      // 단기의 경우 비용 부담이 적으므로 예산 매칭을 더 관대하게
      if (duration === "short") {
        if (budget === "50-70") budgetMatch = 100;
        else if (budget === "70-90") budgetMatch = 100;
        else if (budget === "90+") budgetMatch = 100;
        else budgetMatch = 85;
      } else {
        if (budget === "50-70" && region.cost <= 700000) budgetMatch = 100;
        else if (budget === "70-90" && region.cost <= 900000) budgetMatch = 100;
        else if (budget === "90+") budgetMatch = 100;
        else if (budget === "70-90" && region.cost <= 700000) budgetMatch = 80;
        else budgetMatch = 50;
      }

      totalScore += budgetMatch * 0.15;
      maxScore += 15;
    }

    // 성향 매칭
    if (userResponses.personality) {
      let personalityScore = 0;

      // 지역별 성향 선호도 (가상 데이터)
      const regionPersonality = {
        "강원도 평창군": {
          social: { extrovert: 85, introvert: 70, balanced: 90 },
          activity: { group: 90, individual: 75, small: 80 },
          adaptation: { quick: 85, gradual: 75, careful: 70 },
          stress: { active: 95, calm: 70 },
        },
        "전라남도 순천시": {
          social: { extrovert: 80, introvert: 85, balanced: 85 },
          activity: { group: 85, individual: 80, small: 90 },
          adaptation: { quick: 75, gradual: 90, careful: 85 },
          stress: { active: 80, calm: 85 },
        },
        "전라북도 전주시": {
          social: { extrovert: 75, introvert: 90, balanced: 80 },
          activity: { group: 80, individual: 85, small: 95 },
          adaptation: { quick: 70, gradual: 85, careful: 90 },
          stress: { active: 70, calm: 90 },
        },
      };

      const regionPref = regionPersonality[regionName];
      if (regionPref) {
        Object.keys(userResponses.personality).forEach((category) => {
          const userChoice = userResponses.personality[category];
          const score = regionPref[category][userChoice] || 75;
          personalityScore += score;
        });

        // 성향 점수를 평균내고 가중치 적용
        const avgPersonalityScore =
          personalityScore / Object.keys(userResponses.personality).length;
        totalScore += avgPersonalityScore * 0.25;
        maxScore += 25;
      }
    }

    const finalScore = Math.round((totalScore / maxScore) * 100);

    matchingResults.push({
      region: regionName,
      score: Math.min(finalScore, 98), // 최대 98%
      cost: region.cost,
      features: region.features,
      schools: region.schools,
      capacity: region.capacity,
      description: region.description,
      image: region.image,
      schoolSize: region.schoolSize,
      mainSchool: region.mainSchool,
    });
  });

  // 점수순으로 정렬
  matchingResults.sort((a, b) => b.score - a.score);
}

// 지역 상세 정보 표시
function showRegionDetail(regionName) {
  // 모달 구현 또는 새 페이지로 이동
  alert(`${regionName} 상세 정보를 표시합니다.`);
}

// 지역별 신청
function applyToRegion(regionName) {
  showApplicationForm(regionName);
}

// 신청서 표시
function showApplicationForm(preselectedRegion = null) {
  const modal = new bootstrap.Modal(
    document.getElementById("applicationModal")
  );
  document.getElementById("applicationContent").innerHTML =
    getApplicationFormContent(preselectedRegion);
  modal.show();
}

function getApplicationFormContent(preselectedRegion) {
  return `
        <form id="applicationForm">
            <div class="row mb-3">
                <div class="col-md-4">
                    <label class="form-label">학생 이름 *</label>
                    <input type="text" class="form-control" id="appStudentName" required>
                </div>
                <div class="col-md-4">
                    <label class="form-label">학년 *</label>
                    <select class="form-control" id="appGrade" required>
                        <option value="">선택하세요</option>
                        <option value="1">1학년</option>
                        <option value="2">2학년</option>
                        <option value="3">3학년</option>
                        <option value="4">4학년</option>
                        <option value="5">5학년</option>
                        <option value="6">6학년</option>
                    </select>
                </div>
                <div class="col-md-4">
                    <label class="form-label">성별 *</label>
                    <select class="form-control" id="appGender" required>
                        <option value="">선택하세요</option>
                        <option value="male">남성</option>
                        <option value="female">여성</option>
                        <option value="none">선택안함</option>
                    </select>
                </div>
            </div>
            
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="form-label">학부모 이름 *</label>
                    <input type="text" class="form-control" id="parentName" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label">연락처 *</label>
                    <input type="tel" class="form-control" id="parentPhone" required>
                </div>
            </div>
            
            <div class="mb-3">
                <label class="form-label">이메일 *</label>
                <input type="email" class="form-control" id="parentEmail" required>
            </div>
            
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="form-label">희망 지역 *</label>
                    <select class="form-control" id="preferredRegion" required>
                        <option value="">선택하세요</option>
                        <option value="강원도 평창군" ${
                          preselectedRegion === "강원도 평창군" ? "selected" : ""
                        }>강원도 평창군</option>
                        <option value="전라남도 순천시" ${
                          preselectedRegion === "전라남도 순천시" ? "selected" : ""
                        }>전라남도 순천시</option>
                        <option value="전라북도 전주시" ${
                          preselectedRegion === "전라북도 전주시" ? "selected" : ""
                        }>전라북도 전주시</option>
                    </select>
                </div>
                <div class="col-md-6">
                    <label class="form-label">희망 시작일 *</label>
                    <select class="form-control" id="startDate" required>
                        <option value="">선택하세요</option>
                        <option value="2025-short">2025년 단기 체험</option>
                        <option value="2025-1">2025년 1학기</option>
                        <option value="2025-2">2025년 2학기</option>
                        <option value="2026-1">2026년 1학기</option>
                    </select>
                </div>
            </div>
            
            <div class="mb-3">
                <label class="form-label">신청 동기</label>
                <textarea class="form-control" rows="4" id="motivation" 
                          placeholder="농촌유학을 신청하게 된 동기나 기대하는 점을 적어주세요."></textarea>
            </div>
            
            <div class="mb-3">
                <label class="form-label">특이사항</label>
                <textarea class="form-control" rows="3" id="specialNotes" 
                          placeholder="알레르기, 특별한 관심사, 기타 고려사항이 있다면 적어주세요."></textarea>
            </div>
            
            <div class="mb-3">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="agreeTerms" required>
                    <label class="form-check-label" for="agreeTerms">
                        <a href="#" class="text-primary">개인정보처리방침</a> 및 <a href="#" class="text-primary">이용약관</a>에 동의합니다.
                    </label>
                </div>
            </div>
            
            <div class="text-end">
                <button type="button" class="btn btn-outline-secondary me-2" data-bs-dismiss="modal">취소</button>
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-paper-plane me-2"></i>신청서 제출
                </button>
            </div>
        </form>
    `;
}

// 지역 둘러보기
function showRegions() {
  document.querySelector("#regions").scrollIntoView({ behavior: "smooth" });
}

// 관심지역 담기/해제
function toggleFavorite(regionName, index) {
  const isCurrentlyFavorited = favoriteRegions.includes(regionName);
  
  if (isCurrentlyFavorited) {
    // 제거
    favoriteRegions = favoriteRegions.filter(region => region !== regionName);
    showToast(`${regionName}이(가) 관심지역에서 제거되었습니다.`, 'info');
  } else {
    // 추가
    favoriteRegions.push(regionName);
    showToast(`${regionName}이(가) 관심지역에 추가되었습니다.`, 'success');
  }
  
  // 로컬 스토리지에 저장
  localStorage.setItem('favoriteRegions', JSON.stringify(favoriteRegions));
  
  // 해당 버튼만 업데이트
  updateFavoriteButton(regionName, index);
}

function updateFavoriteButton(regionName, index) {
  const isFavorited = favoriteRegions.includes(regionName);
  const button = document.getElementById(`fav-btn-${index}`);
  
  if (button) {
    // 버튼 스타일 변경
    if (isFavorited) {
      button.classList.add('favorited');
      button.title = '관심지역에서 제거';
    } else {
      button.classList.remove('favorited');
      button.title = '관심지역에 추가';
    }
    
    // 애니메이션 효과
    button.style.transform = 'scale(1.2)';
    setTimeout(() => {
      button.style.transform = 'scale(1)';
    }, 200);
  }
}

// 토스트 알림 표시
function showToast(message, type = 'info') {
  // 기존 토스트 제거
  const existingToast = document.getElementById('favoriteToast');
  if (existingToast) {
    existingToast.remove();
  }
  
  // 토스트 생성
  const toast = document.createElement('div');
  toast.id = 'favoriteToast';
  toast.className = `toast-notification toast-${type}`;
  toast.innerHTML = `
    <div class="d-flex align-items-center">
      <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'} me-2"></i>
      <span>${message}</span>
    </div>
  `;
  
  // 페이지에 추가
  document.body.appendChild(toast);
  
  // 애니메이션으로 표시
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);
  
  // 3초 후 제거
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

// 관심지역 목록 보기
function showFavoriteRegions() {
  if (favoriteRegions.length === 0) {
    showToast('관심지역에 추가된 지역이 없습니다.', 'info');
    return;
  }
  
  let modalContent = `
    <div class="modal fade" id="favoriteModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-heart text-danger me-2"></i>관심지역 목록 (${favoriteRegions.length}개)
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="row g-3">
              ${favoriteRegions.map((region, index) => {
                const regionData = matchingData.regions[region];
                return `
                  <div class="col-md-6">
                    <div class="card border">
                      <div class="row g-0">
                        <div class="col-4">
                          <img src="${regionData.image}" class="img-fluid rounded-start h-100" style="object-fit: cover;" alt="${region}">
                        </div>
                        <div class="col-8">
                          <div class="card-body p-3">
                            <h6 class="card-title text-${getRegionColor(region)} mb-2">${region}</h6>
                            <p class="card-text small text-muted mb-2">${regionData.description}</p>
                            <div class="d-flex justify-content-between align-items-center">
                              <small class="text-muted">${(regionData.cost / 10000).toFixed(0)}만원/월</small>
                              <button class="btn btn-sm btn-outline-danger" onclick="removeFavoriteFromModal('${region}')">
                                <i class="fas fa-times"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
            ${favoriteRegions.length === 0 ? '<p class="text-center text-muted">관심지역이 없습니다.</p>' : ''}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-danger" onclick="clearAllFavorites()">
              <i class="fas fa-trash me-2"></i>모두 삭제
            </button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // 기존 모달 제거
  const existingModal = document.getElementById('favoriteModal');
  if (existingModal) {
    existingModal.remove();
  }
  
  // 새 모달 추가
  document.body.insertAdjacentHTML('beforeend', modalContent);
  
  // 모달 표시
  const modal = new bootstrap.Modal(document.getElementById('favoriteModal'));
  modal.show();
}

// 모달에서 관심지역 제거
function removeFavoriteFromModal(regionName) {
  favoriteRegions = favoriteRegions.filter(region => region !== regionName);
  localStorage.setItem('favoriteRegions', JSON.stringify(favoriteRegions));
  showToast(`${regionName}이(가) 관심지역에서 제거되었습니다.`, 'info');
  
  // 모달 새로고침
  document.getElementById('favoriteModal').remove();
  showFavoriteRegions();
}

// 모든 관심지역 삭제
function clearAllFavorites() {
  if (confirm('모든 관심지역을 삭제하시겠습니까?')) {
    favoriteRegions = [];
    localStorage.setItem('favoriteRegions', JSON.stringify(favoriteRegions));
    showToast('모든 관심지역이 삭제되었습니다.', 'info');
    
    // 모달 닫기
    bootstrap.Modal.getInstance(document.getElementById('favoriteModal')).hide();
  }
}

// 매칭 재시작
function restartMatching() {
  currentStep = 1;
  userResponses = {};
  selectedInterests = [];
  personalityAnswers = {};
  matchingResults = [];
  // 관심지역은 유지 (사용자가 원할 경우만 삭제)
  loadMatchingStep(1);
}

// 결과 저장
function saveResults() {
  const results = {
    timestamp: new Date().toISOString(),
    userResponses: userResponses,
    matchingResults: matchingResults,
  };

  localStorage.setItem("matchingResults", JSON.stringify(results));

  alert("매칭 결과가 저장되었습니다. 언제든지 다시 확인하실 수 있습니다.");

  // 모달 닫기
  bootstrap.Modal.getInstance(document.getElementById("matchingModal")).hide();
}

// 신청서 제출 이벤트
document.addEventListener("submit", function (e) {
  if (e.target.id === "applicationForm") {
    e.preventDefault();
    submitApplication();
  }
});

function submitApplication() {
  // 폼 데이터 수집
  const formData = {
    studentName: document.getElementById("appStudentName").value,
    grade: document.getElementById("appGrade").value,
    gender: document.getElementById("appGender").value,
    parentName: document.getElementById("parentName").value,
    parentPhone: document.getElementById("parentPhone").value,
    parentEmail: document.getElementById("parentEmail").value,
    preferredRegion: document.getElementById("preferredRegion").value,
    startDate: document.getElementById("startDate").value,
    motivation: document.getElementById("motivation").value,
    specialNotes: document.getElementById("specialNotes").value,
    timestamp: new Date().toISOString(),
  };

  // 로컬 스토리지에 저장 (실제 구현에서는 서버로 전송)
  const applications = JSON.parse(localStorage.getItem("applications") || "[]");
  applications.push(formData);
  localStorage.setItem("applications", JSON.stringify(applications));

  // 성공 메시지 표시
  alert(
    "농촌유학 신청이 완료되었습니다!\n\n담당자가 검토 후 3-5일 내에 연락드리겠습니다.\n신청해주셔서 감사합니다."
  );

  // 모달 닫기
  bootstrap.Modal.getInstance(
    document.getElementById("applicationModal")
  ).hide();
}

// ========== 로그인/회원가입 관련 함수들 ==========

// 로그인 모달 표시
function showLoginModal() {
  const modal = new bootstrap.Modal(document.getElementById('loginModal'));
  modal.show();
}

// 회원가입 모달 표시 
function showSignupModal() {
  // 로그인 모달 숨기기
  const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
  if (loginModal) {
    loginModal.hide();
  }
  
  // 회원가입 모달 표시
  const modal = new bootstrap.Modal(document.getElementById('signupModal'));
  modal.show();
}

// 사용자 드롭다운 토글
function toggleUserDropdown() {
  const dropdown = document.getElementById('userDropdown');
  dropdown.classList.toggle('show');
}

// 사용자 타입 카드 선택
function selectUserType(type, element) {
  // 모든 카드에서 선택 해제
  document.querySelectorAll('.user-type-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  // 현재 카드 선택
  element.classList.add('selected');
  
  // hidden input에 값 설정
  document.getElementById('userType').value = type;
  
  // 해당 타입별 추가 필드 표시
  document.querySelectorAll('.user-specific-fields').forEach(field => {
    field.style.display = 'none';
  });
  
  if (type === 'parent') {
    document.getElementById('parentFields').style.display = 'block';
  } else if (type === 'coordinator') {
    document.getElementById('coordinatorFields').style.display = 'block';
  } else if (type === 'admin') {
    document.getElementById('adminFields').style.display = 'block';
  }
}

// 대시보드 표시
function showDashboard() {
  const user = userSystem.currentUser;
  if (!user) return;
  
  let dashboardContent = '';
  
  switch (user.userType) {
    case 'parent':
      dashboardContent = getParentDashboard(user);
      break;
    case 'coordinator':
      dashboardContent = getCoordinatorDashboard(user);
      break;
    case 'admin':
      dashboardContent = getAdminDashboard(user);
      break;
  }
  
  // 대시보드 모달 생성 및 표시
  const modalHtml = `
    <div class="modal fade" id="dashboardModal" tabindex="-1">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header dashboard-${user.userType}">
            <h5 class="modal-title">
              <i class="fas fa-tachometer-alt me-2"></i>${user.name}님의 대시보드
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            ${dashboardContent}
          </div>
        </div>
      </div>
    </div>
  `;
  
  // 기존 모달 제거
  const existingModal = document.getElementById('dashboardModal');
  if (existingModal) {
    existingModal.remove();
  }
  
  // 새 모달 추가
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  
  // 모달 표시
  const modal = new bootstrap.Modal(document.getElementById('dashboardModal'));
  modal.show();
}

// 학부모 대시보드
function getParentDashboard(user) {
  return `
    <div class="row">
      <div class="col-md-4 mb-3">
        <div class="card text-center">
          <div class="card-body">
            <i class="fas fa-child text-primary fa-2x mb-2"></i>
            <h6>등록된 학생</h6>
            <h4 class="text-primary">${user.studentName || '미등록'}</h4>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-3">
        <div class="card text-center">
          <div class="card-body">
            <i class="fas fa-map-marker-alt text-success fa-2x mb-2"></i>
            <h6>관심지역</h6>
            <h4 class="text-success">${favoriteRegions.length}개</h4>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-3">
        <div class="card text-center">
          <div class="card-body">
            <i class="fas fa-paper-plane text-warning fa-2x mb-2"></i>
            <h6>신청현황</h6>
            <h4 class="text-warning">대기중</h4>
          </div>
        </div>
      </div>
    </div>
    
    <div class="row mt-4">
      <div class="col-12">
        <h6>최근 활동</h6>
        <div class="list-group">
          <div class="list-group-item">
            <div class="d-flex w-100 justify-content-between">
              <h6 class="mb-1">AI 매칭 테스트 완료</h6>
              <small>3일 전</small>
            </div>
            <p class="mb-1">강원도 평창군 95% 매칭</p>
          </div>
          <div class="list-group-item">
            <div class="d-flex w-100 justify-content-between">
              <h6 class="mb-1">관심지역 추가</h6>
              <small>1주 전</small>
            </div>
            <p class="mb-1">전라남도 순천시를 관심지역에 추가했습니다.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 코디네이터 대시보드
function getCoordinatorDashboard(user) {
  return `
    <div class="row">
      <div class="col-md-3 mb-3">
        <div class="card text-center">
          <div class="card-body">
            <i class="fas fa-users text-primary fa-2x mb-2"></i>
            <h6>담당 학생</h6>
            <h4 class="text-primary">12명</h4>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="card text-center">
          <div class="card-body">
            <i class="fas fa-school text-success fa-2x mb-2"></i>
            <h6>참여 학교</h6>
            <h4 class="text-success">5개교</h4>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="card text-center">
          <div class="card-body">
            <i class="fas fa-home text-warning fa-2x mb-2"></i>
            <h6>숙소 현황</h6>
            <h4 class="text-warning">8/15</h4>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="card text-center">
          <div class="card-body">
            <i class="fas fa-star text-info fa-2x mb-2"></i>
            <h6>평균 만족도</h6>
            <h4 class="text-info">4.8/5</h4>
          </div>
        </div>
      </div>
    </div>
    
    <div class="row mt-4">
      <div class="col-md-6">
        <h6>대기 중인 신청</h6>
        <div class="list-group">
          <div class="list-group-item">
            <div class="d-flex w-100 justify-content-between">
              <h6 class="mb-1">김민수 (3학년)</h6>
              <small>2일 전</small>
            </div>
            <p class="mb-1">서울 마포구 → ${user.workRegion}</p>
            <button class="btn btn-sm btn-primary">검토하기</button>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <h6>이번 주 일정</h6>
        <div class="list-group">
          <div class="list-group-item">
            <div class="d-flex w-100 justify-content-between">
              <h6 class="mb-1">신입생 오리엔테이션</h6>
              <small>목요일</small>
            </div>
            <p class="mb-1">농촌생활 적응 프로그램</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 교육청 대시보드
function getAdminDashboard(user) {
  return `
    <div class="row">
      <div class="col-md-3 mb-3">
        <div class="card text-center">
          <div class="card-body">
            <i class="fas fa-chart-line text-primary fa-2x mb-2"></i>
            <h6>전체 참여학생</h6>
            <h4 class="text-primary">352명</h4>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="card text-center">
          <div class="card-body">
            <i class="fas fa-map text-success fa-2x mb-2"></i>
            <h6>참여 지역</h6>
            <h4 class="text-success">3개 도</h4>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="card text-center">
          <div class="card-body">
            <i class="fas fa-money-bill-wave text-warning fa-2x mb-2"></i>
            <h6>예산 집행률</h6>
            <h4 class="text-warning">75%</h4>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="card text-center">
          <div class="card-body">
            <i class="fas fa-thumbs-up text-info fa-2x mb-2"></i>
            <h6>전체 만족도</h6>
            <h4 class="text-info">88.1%</h4>
          </div>
        </div>
      </div>
    </div>
    
    <div class="row mt-4">
      <div class="col-md-8">
        <h6>지역별 현황</h6>
        <div class="table-responsive">
          <table class="table table-sm">
            <thead>
              <tr>
                <th>지역</th>
                <th>참여학생</th>
                <th>수용인원</th>
                <th>만족도</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>강원도</td>
                <td>125명</td>
                <td>150명</td>
                <td>4.7/5</td>
                <td><span class="badge bg-success">정상</span></td>
              </tr>
              <tr>
                <td>전라남도</td>
                <td>142명</td>
                <td>160명</td>
                <td>4.8/5</td>
                <td><span class="badge bg-success">정상</span></td>
              </tr>
              <tr>
                <td>전라북도</td>
                <td>85명</td>
                <td>120명</td>
                <td>4.6/5</td>
                <td><span class="badge bg-warning">관심필요</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="col-md-4">
        <h6>최근 이슈</h6>
        <div class="list-group">
          <div class="list-group-item">
            <h6 class="mb-1">예산 재편성 필요</h6>
            <p class="mb-1 small">전북 지역 숙소 확충 예산</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 프로필 보기
function showProfile() {
  const user = userSystem.currentUser;
  if (!user) return;
  
  const modalHtml = `
    <div class="modal fade" id="profileModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-user me-2"></i>프로필 정보
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="text-center mb-4">
              <div class="user-avatar mx-auto mb-3" style="width: 80px; height: 80px; font-size: 2rem;">
                ${user.name.charAt(0).toUpperCase()}
              </div>
              <h5>${user.name}</h5>
              <span class="badge bg-${user.userType === 'parent' ? 'primary' : user.userType === 'coordinator' ? 'success' : 'warning'}">
                ${user.userType === 'parent' ? '학부모' : user.userType === 'coordinator' ? '코디네이터' : '교육청'}
              </span>
            </div>
            
            <div class="row">
              <div class="col-6 mb-3">
                <label class="form-label">이름</label>
                <input type="text" class="form-control" value="${user.name}" readonly>
              </div>
              <div class="col-6 mb-3">
                <label class="form-label">연락처</label>
                <input type="text" class="form-control" value="${user.phone}" readonly>
              </div>
            </div>
            
            <div class="mb-3">
              <label class="form-label">이메일</label>
              <input type="email" class="form-control" value="${user.email}" readonly>
            </div>
            
            ${user.userType === 'parent' && user.studentName ? `
              <div class="mb-3">
                <label class="form-label">학생 이름</label>
                <input type="text" class="form-control" value="${user.studentName}" readonly>
              </div>
            ` : ''}
            
            ${user.workRegion ? `
              <div class="mb-3">
                <label class="form-label">담당 지역</label>
                <input type="text" class="form-control" value="${user.workRegion}" readonly>
              </div>
            ` : ''}
            
            <div class="mb-3">
              <label class="form-label">가입일</label>
              <input type="text" class="form-control" value="${new Date(user.createdAt).toLocaleDateString()}" readonly>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-primary" onclick="editProfile()">
              <i class="fas fa-edit me-2"></i>정보 수정
            </button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // 기존 모달 제거
  const existingModal = document.getElementById('profileModal');
  if (existingModal) {
    existingModal.remove();
  }
  
  // 새 모달 추가
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  
  // 모달 표시
  const modal = new bootstrap.Modal(document.getElementById('profileModal'));
  modal.show();
}

// 프로필 수정 (미구현)
function editProfile() {
  alert('프로필 수정 기능은 준비 중입니다.');
}

// 초기 데이터 설정 (테스트용 계정들)
function initializeTestAccounts() {
  const existingUsers = JSON.parse(localStorage.getItem('sigolfriend_users') || '[]');
  
  // 이미 계정들이 존재하면 스킵
  if (existingUsers.length > 0) return;
  
  const testAccounts = [
    // 1. 학부모 계정
    {
      id: '1',
      name: '김영희',
      phone: '010-1234-5678',
      email: 'parent@test.com',
      password: '123456',
      userType: 'parent',
      studentName: '김민수',
      studentGrade: '4',
      currentSchool: '서울가락초등학교',
      createdAt: new Date().toISOString()
    },
    
    // 2. 지역 코디네이터 계정  
    {
      id: '2',
      name: '박철수',
      phone: '010-2345-6789',
      email: 'coordinator@test.com',
      password: '123456',
      userType: 'coordinator',
      workRegion: '강원도',
      workOrganization: '평창군 농촌유학 지원센터',
      createdAt: new Date().toISOString()
    },
    
    // 3. 교육청 담당자 계정
    {
      id: '3',
      name: '이정미',
      phone: '010-3456-7890',
      email: 'admin@test.com',
      password: '123456',
      userType: 'admin',
      adminRegion: '서울특별시교육청',
      department: '혁신교육과',
      createdAt: new Date().toISOString()
    },
    
    // 4. 추가 학부모 계정
    {
      id: '4',
      name: '최수지',
      phone: '010-4567-8901',
      email: 'parent2@test.com',
      password: '123456',
      userType: 'parent',
      studentName: '최지훈',
      studentGrade: '3',
      currentSchool: '서울명일초등학교',
      createdAt: new Date().toISOString()
    },
    
    // 5. 전남 코디네이터 계정
    {
      id: '5',
      name: '한미영',
      phone: '010-5678-9012',
      email: 'coordinator2@test.com',
      password: '123456',
      userType: 'coordinator',
      workRegion: '전라남도',
      workOrganization: '곡성군 농촌유학센터',
      createdAt: new Date().toISOString()
    }
  ];
  
  localStorage.setItem('sigolfriend_users', JSON.stringify(testAccounts));
  console.log('테스트 계정들이 생성되었습니다.');
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
  // 테스트 계정 초기화
  initializeTestAccounts();
  
  // 현재 사용자 정보 로드
  userSystem.loadCurrentUser();
  
  // 사용자 타입 카드 클릭 이벤트
  document.querySelectorAll('.user-type-card').forEach(card => {
    card.addEventListener('click', function() {
      const type = this.getAttribute('data-type');
      selectUserType(type, this);
    });
  });
  
  // 로그인 폼 이벤트
  document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const result = userSystem.login(email, password);
    
    if (result.success) {
      // 로그인 성공
      bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
      showToast(`${result.user.name}님, 환영합니다!`, 'success');
    } else {
      // 로그인 실패
      showToast(result.message, 'error');
    }
  });
  
  // 회원가입 폼 이벤트
  document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // 비밀번호 확인
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
      showToast('비밀번호가 일치하지 않습니다.', 'error');
      return;
    }
    
    // 사용자 타입 확인
    const userType = document.getElementById('userType').value;
    if (!userType) {
      showToast('계정 유형을 선택해주세요.', 'error');
      return;
    }
    
    // 폼 데이터 수집
    const userData = {
      name: document.getElementById('signupName').value,
      phone: document.getElementById('signupPhone').value,
      email: document.getElementById('signupEmail').value,
      password: password,
      userType: userType
    };
    
    // 사용자 타입별 추가 정보
    if (userType === 'parent') {
      userData.studentName = document.getElementById('studentName').value;
      userData.studentGrade = document.getElementById('studentGrade').value;
      userData.currentSchool = document.getElementById('currentSchool').value;
    } else if (userType === 'coordinator') {
      userData.workRegion = document.getElementById('workRegion').value;
      userData.workOrganization = document.getElementById('workOrganization').value;
    } else if (userType === 'admin') {
      userData.adminRegion = document.getElementById('adminRegion').value;
      userData.department = document.getElementById('department').value;
    }
    
    const result = userSystem.signup(userData);
    
    if (result.success) {
      // 회원가입 성공
      bootstrap.Modal.getInstance(document.getElementById('signupModal')).hide();
      showToast('회원가입이 완료되었습니다. 로그인해주세요.', 'success');
      
      // 로그인 모달 표시
      setTimeout(() => {
        showLoginModal();
      }, 500);
    } else {
      // 회원가입 실패
      showToast(result.message, 'error');
    }
  });
  
  // 외부 클릭 시 드롭다운 숨기기
  document.addEventListener('click', function(e) {
    const userMenu = document.querySelector('.user-menu');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userMenu && userDropdown && !userMenu.contains(e.target)) {
      userDropdown.classList.remove('show');
    }
  });
});

// ========== 24시간 AI 챗봇 시스템 ==========

// 챗봇 상태 관리
const chatbotSystem = {
  isOpen: false,
  isTyping: false,
  
  // FAQ 데이터베이스
  faqDatabase: {
    '농촌유학이 뭔가요?': {
      answer: `농촌유학은 도시 학생들이 일정 기간 농촌 지역에서 생활하며 농촌 학교에 다니는 교육 프로그램입니다. 🏫
      
      <strong>주요 특징:</strong>
      • 6개월~1년 기간으로 운영
      • 가족체류형(85%)이 가장 많음
      • 강원도, 전남, 전북 지역에서 운영
      • 농촌 문화와 자연을 체험하며 성장`,
      followUp: ['비용이 얼마나 드나요?', 'AI 매칭은 어떻게 하나요?', '숙소는 어떻게 구하나요?']
    },
    
    '비용이 얼마나 드나요?': {
      answer: `농촌유학 비용은 지역별로 차이가 있습니다. 💰
      
      <strong>월 평균 비용:</strong>
      • 전북 임실군: 25만원
      • 전남 곡성군: 30만원  
      • 강원 평창군: 35만원
      
      <strong>지원 제도:</strong>
      • 교육청별 유학경비 지원 (30~60만원)
      • 지자체 추가 지원금 있음
      • 숙박비, 식비, 교통비 포함`,
      followUp: ['지원금은 어떻게 받나요?', '추가 비용은 뭐가 있나요?', '예산 계산기를 써보고 싶어요']
    },
    
    '신청 방법을 알려주세요': {
      answer: `농촌유학 신청은 3단계로 진행됩니다! 📝
      
      <strong>1단계: 회원가입 & 정보입력</strong>
      • 학부모 계정으로 가입
      • 학생 정보 등록
      
      <strong>2단계: AI 매칭 & 지역선택</strong>  
      • AI 매칭 테스트 완료
      • 추천 지역 3곳 확인
      
      <strong>3단계: 신청완료 & 배정</strong>
      • 온라인 신청서 제출
      • 서류 검토 후 최종 배정 (3-5일)`,
      followUp: ['AI 매칭 시작하기', '필요한 서류는 뭔가요?', '언제까지 신청해야 하나요?']
    },
    
    'AI 매칭은 어떻게 하나요?': {
      answer: `AI 매칭은 아이의 성향과 관심사를 분석해서 최적의 지역을 추천해드려요! 🤖
      
      <strong>매칭 요소:</strong>
      • 관심사/적성 (40점) - 농업체험, 생태학습 등
      • 환경 선호도 (30점) - 산/바다/강 선호도
      • 학교 규모 (20점) - 소규모/중규모 선호
      • 기간/예산 (10점) - 희망 기간과 예산
      
      <strong>매칭률:</strong>
      • 평균 95% 이상의 높은 매칭률
      • 실시간 자리 현황 반영`,
      followUp: ['AI 매칭 시작하기', '매칭률이 낮으면 어떻게 하나요?', '다시 매칭할 수 있나요?']
    },
    
    '숙소는 어떻게 구하나요?': {
      answer: `숙소는 저희 플랫폼에서 통합 관리하고 있어요! 🏠
      
      <strong>숙소 유형:</strong>
      • 가족체류형 (85%) - 독립된 주택
      • 기숙사형 - 학교 기숙사
      • 민박형 - 농가 민박
      
      <strong>숙소 지원:</strong>
      • VR로 미리 둘러보기 가능
      • 투명한 임대료 정보 공개
      • 품질 인증된 숙소만 제공
      • 24시간 문제 해결 지원`,
      followUp: ['VR 투어 해보기', '숙소 비용은 얼마인가요?', '숙소에 문제가 생기면?']
    },
    
    '만족도가 어떤가요?': {
      answer: `농촌유학 만족도는 매우 높습니다! ⭐
      
      <strong>2024년 통계:</strong>
      • 전체 만족도: 88.1%
      • 추천 의향: 85.7%
      • 참여 학생: 352명 (3년간 300% 증가)
      
      <strong>주요 만족 요인:</strong>
      • 자연친화적 환경
      • 소규모 학급의 맞춤 교육
      • 다양한 체험 프로그램
      • 인성 발달과 자립심 향상`,
      followUp: ['후기를 보고 싶어요', '어떤 점이 가장 좋은가요?', '문제점은 없나요?']
    },
    
    '문제가 생기면 어떻게 하나요?': {
      answer: `24시간 종합 지원 시스템으로 든든하게 도와드려요! 🆘
      
      <strong>지원 체계:</strong>
      • 24시간 AI 상담 (지금 이용 중!)
      • 전문가 화상 상담 예약
      • 지역별 코디네이터 직접 연결
      • 응급상황 즉시 대응
      
      <strong>주요 지원 분야:</strong>
      • 적응 문제 상담
      • 숙소/학교 관련 이슈
      • 건강/안전 문제
      • 학습 지원`,
      followUp: ['전문가 상담 예약하기', '응급상황 연락처', '자주 생기는 문제들']
    }
  },
  
  // 챗봇 토글
  toggle() {
    const chatbotWindow = document.getElementById('chatbotWindow');
    this.isOpen = !this.isOpen;
    
    if (this.isOpen) {
      chatbotWindow.classList.add('show');
    } else {
      chatbotWindow.classList.remove('show');
    }
  },
  
  // 메시지 추가
  addMessage(content, isUser = false, hasQuickButtons = false) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageEl = document.createElement('div');
    messageEl.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    const avatarIcon = isUser ? 'fa-user' : 'fa-robot';
    
    messageEl.innerHTML = `
      <div class="message-avatar">
        <i class="fas ${avatarIcon}"></i>
      </div>
      <div class="message-content">
        ${content}
      </div>
    `;
    
    messagesContainer.appendChild(messageEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    return messageEl;
  },
  
  // 타이핑 인디케이터 표시
  showTyping() {
    if (this.isTyping) return;
    
    this.isTyping = true;
    const typingEl = document.createElement('div');
    typingEl.className = 'message bot-message typing-message';
    typingEl.innerHTML = `
      <div class="message-avatar">
        <i class="fas fa-robot"></i>
      </div>
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    
    const messagesContainer = document.getElementById('chatbotMessages');
    messagesContainer.appendChild(typingEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    return typingEl;
  },
  
  // 타이핑 인디케이터 제거
  hideTyping() {
    this.isTyping = false;
    const typingEl = document.querySelector('.typing-message');
    if (typingEl) {
      typingEl.remove();
    }
  },
  
  // AI 응답 생성
  generateResponse(userMessage) {
    const message = userMessage.toLowerCase().trim();
    
    // FAQ 검색
    for (const [question, data] of Object.entries(this.faqDatabase)) {
      if (this.isMessageMatch(message, question)) {
        return this.formatResponse(data.answer, data.followUp);
      }
    }
    
    // 키워드 기반 응답
    if (message.includes('비용') || message.includes('돈') || message.includes('가격')) {
      return this.formatResponse(
        `농촌유학 비용에 대해 궁금하시군요! 💰 지역별로 월 25~35만원 정도이며, 교육청 지원금도 있어요.`,
        ['비용이 얼마나 드나요?', '지원금은 어떻게 받나요?']
      );
    }
    
    if (message.includes('지역') || message.includes('강원') || message.includes('전남') || message.includes('전북')) {
      return this.formatResponse(
        `현재 강원도, 전남, 전북 3개 도에서 농촌유학을 운영하고 있어요! 🗺️ AI 매칭으로 우리 아이에게 딱 맞는 지역을 찾아드릴게요.`,
        ['AI 매칭 시작하기', '지역별 차이점은?', '어느 지역이 좋나요?']
      );
    }
    
    if (message.includes('학교') || message.includes('교육')) {
      return this.formatResponse(
        `농촌 학교는 소규모로 운영되어 맞춤형 교육이 가능해요! 📚 평균 학급당 15명 내외로 선생님의 세심한 관심을 받을 수 있어요.`,
        ['학교는 어떤가요?', '교육과정은?', '친구들과 잘 지낼까요?']
      );
    }
    
    if (message.includes('안전') || message.includes('걱정') || message.includes('문제')) {
      return this.formatResponse(
        `안전과 관련해서 걱정이 많으시겠어요. 😊 24시간 지원 시스템과 지역 코디네이터가 항상 도움을 드리고 있으니 안심하세요!`,
        ['문제가 생기면 어떻게 하나요?', '응급상황 대응', '안전 관리 시스템']
      );
    }
    
    // 기본 응답
    return this.formatResponse(
      `죄송해요, 정확히 이해하지 못했어요. 😅 아래 자주 묻는 질문들을 참고해보시거나, 다른 방식으로 질문해주세요!`,
      ['농촌유학이 뭔가요?', '비용이 얼마나 드나요?', '신청 방법을 알려주세요']
    );
  },
  
  // 메시지 매칭 확인
  isMessageMatch(userMessage, question) {
    const userWords = userMessage.split(' ');
    const questionWords = question.toLowerCase().split(' ');
    
    let matchCount = 0;
    for (const word of questionWords) {
      if (userMessage.includes(word)) {
        matchCount++;
      }
    }
    
    return matchCount >= Math.min(2, questionWords.length);
  },
  
  // 응답 포맷팅
  formatResponse(answer, followUp = []) {
    let response = `<p>${answer}</p>`;
    
    if (followUp.length > 0) {
      response += `
        <div class="quick-buttons">
          ${followUp.map(question => 
            `<button class="quick-btn" onclick="sendQuickMessage('${question}')">${question}</button>`
          ).join('')}
        </div>
      `;
    }
    
    return response;
  },
  
  // 메시지 전송 처리
  async sendMessage(userMessage) {
    if (!userMessage.trim()) return;
    
    // 사용자 메시지 추가
    this.addMessage(`<p>${userMessage}</p>`, true);
    
    // 타이핑 인디케이터 표시
    const typingEl = this.showTyping();
    
    // 응답 생성 (실제로는 API 호출)
    setTimeout(() => {
      this.hideTyping();
      const response = this.generateResponse(userMessage);
      this.addMessage(response);
    }, 1000 + Math.random() * 1000); // 1-2초 지연
  }
};

// 전역 함수들
function toggleChatbot() {
  chatbotSystem.toggle();
}

function sendMessage(event) {
  event.preventDefault();
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  
  if (message) {
    chatbotSystem.sendMessage(message);
    input.value = '';
  }
}

function sendQuickMessage(message) {
  chatbotSystem.sendMessage(message);
}

// 빠른 로그인 기능
function quickLogin(email, password) {
  document.getElementById('loginEmail').value = email;
  document.getElementById('loginPassword').value = password;
  
  const result = userSystem.login(email, password);
  
  if (result.success) {
    // 로그인 성공
    bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
    showToast(`${result.user.name}님, 환영합니다!`, 'success');
  } else {
    // 로그인 실패
    showToast(result.message, 'error');
  }
}
