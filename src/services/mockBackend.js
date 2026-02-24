import MockAdapter from 'axios-mock-adapter';

const DB_KEY = 'wellness-mock-db';

const starterAccounts = [
  {
    email: 'student@wellness.local',
    password: 'Student@123',
    role: 'STUDENT',
    name: 'Demo Student',
  },
  {
    email: 'admin@wellness.local',
    password: 'Admin@123',
    role: 'ADMIN',
    name: 'Demo Admin',
  },
];

const seedDatabase = {
  users: [...starterAccounts],
  resources: [
    {
      id: 'r1',
      title: 'Managing Stress During Exams',
      description: 'Simple breathing and planning methods to reduce exam stress.',
      category: 'MENTAL',
      url: '#',
    },
    {
      id: 'r2',
      title: '10-Minute Dorm Workout',
      description: 'No-equipment workout routine designed for busy students.',
      category: 'FITNESS',
      url: '#',
    },
    {
      id: 'r3',
      title: 'Smart Meal Prep on Budget',
      description: 'Weekly nutrition strategy for healthy and affordable eating.',
      category: 'NUTRITION',
      url: '#',
    },
    {
      id: 'r4',
      title: 'Sleep Recovery Guide',
      description: 'Build better sleep habits and recover from burnout patterns.',
      category: 'MENTAL',
      url: '#',
    },
  ],
  programs: [
    {
      id: 'p1',
      title: 'Mindfulness Basics',
      description: 'Guided mindfulness sessions for better focus and calm.',
      duration: '4 weeks',
    },
    {
      id: 'p2',
      title: 'Campus Fitness Kickstart',
      description: 'Starter fitness plan with weekly activity goals.',
      duration: '8 weeks',
    },
    {
      id: 'p3',
      title: 'Balanced Nutrition Habits',
      description: 'Practical nutrition planning for student schedules.',
      duration: '6 weeks',
    },
  ],
  enrollments: {
    'student@wellness.local': [
      { programId: 'p1', status: 'IN_PROGRESS' },
      { programId: 'p2', status: 'COMPLETED' },
    ],
  },
  supportRequests: [
    {
      id: 's1',
      subject: 'Need counseling session',
      category: 'MENTAL',
      message: 'I am feeling overwhelmed and need to talk to someone.',
      status: 'OPEN',
      studentEmail: 'student@wellness.local',
    },
  ],
  moods: [],
  usage: {
    dailyLogins: 22,
    resourceClicks: 138,
    programEnrollments: 17,
    supportSubmissions: 9,
  },
};

const readDb = () => {
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) {
    localStorage.setItem(DB_KEY, JSON.stringify(seedDatabase));
    return structuredClone(seedDatabase);
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.setItem(DB_KEY, JSON.stringify(seedDatabase));
    return structuredClone(seedDatabase);
  }
};

const writeDb = (db) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

const parseBody = (config) => {
  if (!config.data) {
    return {};
  }

  try {
    return JSON.parse(config.data);
  } catch {
    return {};
  }
};

const randomId = (prefix) => `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;

const getCurrentUser = () => {
  const rawUser = localStorage.getItem('user');

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
};

const asData = (payload) => [200, { data: payload }];

export const setupMockBackend = (api) => {
  const mock = new MockAdapter(api, { delayResponse: 350 });

  mock.onPost('/auth/login').reply((config) => {
    const db = readDb();
    const { email, password } = parseBody(config);
    const normalizedEmail = (email || '').trim().toLowerCase();

    const user = db.users.find(
      (candidate) => candidate.email.toLowerCase() === normalizedEmail && candidate.password === password
    );

    if (!user) {
      return [401, { message: 'Invalid email or password' }];
    }

    db.usage.dailyLogins += 1;
    writeDb(db);

    return [
      200,
      {
        token: `mock-token-${user.role.toLowerCase()}-${Date.now()}`,
        user: {
          email: user.email,
          role: user.role,
          name: user.name,
        },
      },
    ];
  });

  mock.onPost('/auth/register').reply((config) => {
    const db = readDb();
    const payload = parseBody(config);
    const normalizedEmail = (payload.email || '').trim().toLowerCase();

    if (!payload.email || !payload.password || !payload.name) {
      return [400, { message: 'Name, email, and password are required.' }];
    }

    const exists = db.users.some((user) => user.email.toLowerCase() === normalizedEmail);

    if (exists) {
      return [409, { message: 'Account already exists for this email.' }];
    }

    db.users.push({
      email: normalizedEmail,
      password: payload.password,
      role: payload.role || 'STUDENT',
      name: payload.name,
    });

    writeDb(db);

    return [201, { message: 'Account created successfully.' }];
  });

  mock.onGet('/resources').reply((config) => {
    const db = readDb();
    const category = config.params?.category;

    const data = category
      ? db.resources.filter((resource) => resource.category === category)
      : db.resources;

    return asData(data);
  });

  mock.onGet('/resources/recent').reply(() => {
    const db = readDb();
    return asData(db.resources.slice(0, 4));
  });

  mock.onGet('/programs').reply(() => {
    const db = readDb();
    const currentUser = getCurrentUser();
    const userEmail = currentUser?.email;
    const userEnrollments = userEmail ? db.enrollments[userEmail] || [] : [];

    const data = db.programs.map((program) => ({
      ...program,
      enrolled: userEnrollments.some((entry) => entry.programId === program.id),
    }));

    return asData(data);
  });

  mock.onPost(/^\/programs\/[^/]+\/enroll$/).reply((config) => {
    const db = readDb();
    const currentUser = getCurrentUser();

    if (!currentUser?.email) {
      return [401, { message: 'Unauthorized' }];
    }

    const parts = config.url.split('/');
    const programId = parts[2];

    db.enrollments[currentUser.email] = db.enrollments[currentUser.email] || [];

    const alreadyEnrolled = db.enrollments[currentUser.email].some(
      (entry) => entry.programId === programId
    );

    if (!alreadyEnrolled) {
      db.enrollments[currentUser.email].push({ programId, status: 'IN_PROGRESS' });
      db.usage.programEnrollments += 1;
    }

    writeDb(db);

    return [200, { message: 'Enrolled successfully' }];
  });

  mock.onGet('/programs/my').reply(() => {
    const db = readDb();
    const currentUser = getCurrentUser();
    const userEmail = currentUser?.email;
    const userEnrollments = userEmail ? db.enrollments[userEmail] || [] : [];

    const data = userEnrollments
      .map((enrollment) => {
        const program = db.programs.find((item) => item.id === enrollment.programId);

        if (!program) {
          return null;
        }

        return {
          ...program,
          status: enrollment.status,
        };
      })
      .filter(Boolean);

    return asData(data);
  });

  mock.onGet('/student/enrolled').reply(() => {
    const db = readDb();
    const currentUser = getCurrentUser();
    const userEmail = currentUser?.email;
    const userEnrollments = userEmail ? db.enrollments[userEmail] || [] : [];

    const data = userEnrollments
      .map((enrollment) => {
        const program = db.programs.find((item) => item.id === enrollment.programId);

        if (!program) {
          return null;
        }

        return {
          id: program.id,
          programName: program.title,
          duration: Number.parseInt(program.duration, 10) || 6,
          status: enrollment.status,
        };
      })
      .filter(Boolean);

    return [200, data];
  });

  mock.onGet('/student/dashboard-stats').reply(() => {
    const db = readDb();
    const currentUser = getCurrentUser();
    const userEmail = currentUser?.email;
    const userEnrollments = userEmail ? db.enrollments[userEmail] || [] : [];
    const userRequests = db.supportRequests.filter((request) => request.studentEmail === userEmail);

    const data = {
      resourcesViewed: Math.max(6, db.usage.resourceClicks % 30),
      programsEnrolled: userEnrollments.length,
      pendingSupport: userRequests.filter((request) => request.status !== 'RESOLVED').length,
    };

    return asData(data);
  });

  mock.onGet('/student/stats').reply(() => {
    const db = readDb();
    const currentUser = getCurrentUser();
    const userEmail = currentUser?.email;
    const userEnrollments = userEmail ? db.enrollments[userEmail] || [] : [];
    const userRequests = db.supportRequests.filter((request) => request.studentEmail === userEmail);

    return [
      200,
      {
        enrolledPrograms: userEnrollments.length,
        completedPrograms: userEnrollments.filter((entry) => entry.status === 'COMPLETED').length,
        supportRequests: userRequests.length,
      },
    ];
  });

  mock.onPost('/student/mood').reply((config) => {
    const db = readDb();
    const payload = parseBody(config);
    const currentUser = getCurrentUser();

    db.moods.push({
      id: randomId('m'),
      mood: payload.mood,
      email: currentUser?.email || 'anonymous',
      createdAt: new Date().toISOString(),
    });

    writeDb(db);

    return [201, { message: 'Mood saved.' }];
  });

  mock.onPost('/support-requests').reply((config) => {
    const db = readDb();
    const payload = parseBody(config);
    const currentUser = getCurrentUser();

    const request = {
      id: randomId('s'),
      subject: payload.subject,
      category: payload.category || 'GENERAL',
      message: payload.message,
      status: 'OPEN',
      studentEmail: currentUser?.email || 'student@wellness.local',
    };

    db.supportRequests.unshift(request);
    db.usage.supportSubmissions += 1;
    writeDb(db);

    return [201, { message: 'Request submitted.' }];
  });

  mock.onGet('/admin/support-requests').reply(() => {
    const db = readDb();
    return asData(db.supportRequests);
  });

  mock.onPatch(/^\/admin\/support-requests\/[^/]+$/).reply((config) => {
    const db = readDb();
    const payload = parseBody(config);
    const id = config.url.split('/')[3];

    db.supportRequests = db.supportRequests.map((request) =>
      request.id === id ? { ...request, status: payload.status || request.status } : request
    );

    writeDb(db);

    return [200, { message: 'Status updated.' }];
  });

  mock.onGet('/admin/resources').reply(() => {
    const db = readDb();
    return asData(db.resources);
  });

  mock.onPost('/admin/resources').reply((config) => {
    const db = readDb();
    const payload = parseBody(config);

    const resource = {
      id: randomId('r'),
      title: payload.title,
      description: payload.description,
      category: payload.category || 'MENTAL',
      url: payload.url || '#',
    };

    db.resources.unshift(resource);
    writeDb(db);

    return [201, { message: 'Resource created.' }];
  });

  mock.onPut(/^\/admin\/resources\/[^/]+$/).reply((config) => {
    const db = readDb();
    const payload = parseBody(config);
    const id = config.url.split('/')[3];

    db.resources = db.resources.map((resource) =>
      resource.id === id ? { ...resource, ...payload } : resource
    );

    writeDb(db);

    return [200, { message: 'Resource updated.' }];
  });

  mock.onDelete(/^\/admin\/resources\/[^/]+$/).reply((config) => {
    const db = readDb();
    const id = config.url.split('/')[3];

    db.resources = db.resources.filter((resource) => resource.id !== id);
    writeDb(db);

    return [200, { message: 'Resource deleted.' }];
  });

  mock.onGet('/admin/programs').reply(() => {
    const db = readDb();
    return asData(db.programs);
  });

  mock.onPost('/admin/programs').reply((config) => {
    const db = readDb();
    const payload = parseBody(config);

    const program = {
      id: randomId('p'),
      title: payload.title,
      description: payload.description,
      duration: payload.duration || '6 weeks',
    };

    db.programs.unshift(program);
    writeDb(db);

    return [201, { message: 'Program created.' }];
  });

  mock.onPut(/^\/admin\/programs\/[^/]+$/).reply((config) => {
    const db = readDb();
    const payload = parseBody(config);
    const id = config.url.split('/')[3];

    db.programs = db.programs.map((program) =>
      program.id === id ? { ...program, ...payload } : program
    );

    writeDb(db);

    return [200, { message: 'Program updated.' }];
  });

  mock.onDelete(/^\/admin\/programs\/[^/]+$/).reply((config) => {
    const db = readDb();
    const id = config.url.split('/')[3];

    db.programs = db.programs.filter((program) => program.id !== id);
    Object.keys(db.enrollments).forEach((email) => {
      db.enrollments[email] = db.enrollments[email].filter((entry) => entry.programId !== id);
    });

    writeDb(db);

    return [200, { message: 'Program deleted.' }];
  });

  mock.onGet('/admin/dashboard-stats').reply(() => {
    const db = readDb();

    const data = {
      totalStudents: db.users.filter((user) => user.role === 'STUDENT').length,
      activePrograms: db.programs.length,
      openRequests: db.supportRequests.filter((request) => request.status !== 'RESOLVED').length,
      resourceViews: db.usage.resourceClicks,
    };

    return asData(data);
  });

  mock.onGet('/admin/metrics').reply(() => {
    const db = readDb();

    return asData({
      dailyLogins: db.usage.dailyLogins,
      resourceClicks: db.usage.resourceClicks,
      programEnrollments: db.usage.programEnrollments,
      supportSubmissions: db.usage.supportSubmissions,
    });
  });

  return mock;
};
