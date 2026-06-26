import { db, auth } from './firebase';
import { 
  collection, doc, setDoc, getDoc, getDocs, updateDoc, 
  query, where, orderBy, addDoc, deleteDoc, increment,
  onSnapshot
} from 'firebase/firestore';

// All available languages
export const ALL_LANGUAGES = [
  { id: 'html', name: 'HTML', icon: '🌐', color: '#E34F26', courses: 4 },
  { id: 'css', name: 'CSS', icon: '🎨', color: '#1572B6', courses: 4 },
  { id: 'js', name: 'JavaScript', icon: '⚡', color: '#F7DF1E', courses: 5 },
  { id: 'py', name: 'Python', icon: '🐍', color: '#3776AB', courses: 5 },
  { id: 'csharp', name: 'C#', icon: '🔷', color: '#68217A', courses: 4 },
  { id: 'cpp', name: 'C++', icon: '⚙️', color: '#00599C', courses: 4 }
];

// ---------- USER PROFILE WITH LANGUAGES ----------
export const getUserProfile = async (userId) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    }
    return { success: false, error: "User not found" };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update user's selected languages (MAX 2)
export const updateUserLanguages = async (userId, selectedLanguages) => {
  try {
    if (selectedLanguages.length > 2) {
      return { success: false, error: "Maximum 2 languages can be selected" };
    }
    
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    let languageProgress = {};
    selectedLanguages.forEach(lang => {
      const existingProgress = userSnap.data()?.languageProgress?.[lang] || {
        level: "Beginner",
        progress: 0,
        coursesCompleted: 0,
        totalCourses: ALL_LANGUAGES.find(l => l.id === lang)?.courses || 4
      };
      languageProgress[lang] = existingProgress;
    });
    
    await updateDoc(userRef, {
      selectedLanguages: selectedLanguages,
      languageProgress: languageProgress,
      updatedAt: new Date().toISOString()
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};


// userData.js - Replace updateLanguageProgress with this

// userData.js - Replace updateLanguageProgress with this

export const updateLanguageProgress = async (userId, languageId) => {
  try {
    console.log(`📊 Updating language progress for: ${languageId}`);
    
    // ✅ FIX: Map language to standard ID
    const languageMap = {
      'pyton': 'py',
      'python': 'py',
      'javascript': 'js',
      'c#': 'csharp',
      'c++': 'cpp'
    };
    const standardLangId = languageMap[languageId] || languageId;
    
    const q = query(
      collection(db, "userCourses"), 
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const courses = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // ✅ Check both original and mapped language
      if (data.language === languageId || data.language === standardLangId) {
        courses.push(data);
      }
    });
    
    console.log(`📊 Found ${courses.length} courses for language ${standardLangId}`);
    
    if (courses.length === 0) {
      return { success: true, progress: 0, level: "Beginner" };
    }
    
    let totalPercentage = 0;
    let completedCourses = 0;
    
    courses.forEach(course => {
      const validPercentage = Math.min(course.percentage || 0, 100);
      totalPercentage += validPercentage;
      if (course.status === 'completed') completedCourses++;
    });
    
    const averageProgress = Math.round(totalPercentage / courses.length);
    console.log(`📊 Average progress: ${averageProgress}%`);
    
    let level = "Beginner";
    if (averageProgress >= 80) level = "Expert";
    else if (averageProgress >= 50) level = "Intermediate";
    else if (averageProgress >= 25) level = "Advanced Beginner";
    
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      [`languageProgress.${standardLangId}`]: {
        progress: averageProgress,
        coursesCompleted: completedCourses,
        totalCourses: ALL_LANGUAGES.find(l => l.id === standardLangId)?.courses || 4,
        level: level,
        updatedAt: new Date().toISOString()
      }
    });
    
    console.log(`✅ Language progress updated: ${averageProgress}%`);
    return { success: true, progress: averageProgress, level };
  } catch (error) {
    console.error("❌ Error:", error);
    return { success: false, error: error.message };
  }
};

// Get user's selected languages with progress
export const getUserLanguagesWithProgress = async (userId) => {
  try {
    const userSnap = await getUserProfile(userId);
    if (!userSnap.success) return { success: false, data: [] };
    
    const selectedLanguages = userSnap.data.selectedLanguages || userSnap.data.technologies || [];
    const languageProgress = userSnap.data.languageProgress || {};
    
    const languagesWithProgress = selectedLanguages.map(langId => {
      const langInfo = ALL_LANGUAGES.find(l => l.id === langId);
      const progress = languageProgress[langId] || {
        progress: 0,
        coursesCompleted: 0,
        totalCourses: langInfo?.courses || 4,
        level: "Beginner"
      };
      return {
        id: langId,
        name: langInfo?.name || langId,
        icon: langInfo?.icon || '📚',
        color: langInfo?.color || '#00ADB5',
        ...progress
      };
    });
    
    return { success: true, data: languagesWithProgress };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update user points
export const updateUserPoints = async (userId, pointsToAdd) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      points: increment(pointsToAdd)
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update streak on daily login
// export const updateUserStreak = async (userId) => {
//   try {
//     const userRef = doc(db, "users", userId);
//     const userSnap = await getDoc(userRef);
    
//     if (userSnap.exists()) {
//       const userData = userSnap.data();
//       const lastLogin = userData.lastLogin ? new Date(userData.lastLogin) : null;
//       const today = new Date();
//       const yesterday = new Date(today);
//       yesterday.setDate(yesterday.getDate() - 1);
      
//       let newStreak = userData.streak || 0;
      
//       if (!lastLogin) {
//         newStreak = 1;
//       } else if (lastLogin.toDateString() === yesterday.toDateString()) {
//         newStreak++;
//       } else if (lastLogin.toDateString() !== today.toDateString()) {
//         newStreak = 1;
//       }
      
//       await updateDoc(userRef, {
//         streak: newStreak,
//         lastLogin: today.toISOString()
//       });
      
//       // Check streak achievements
//       if (newStreak === 7) await awardAchievement(userId, "streak_7");
//       if (newStreak === 30) await awardAchievement(userId, "streak_30");
      
//       return { success: true, streak: newStreak };
//     }
//     return { success: false };
//   } catch (error) {
//     return { success: false, error: error.message };
//   }
// };

export const updateUserStreak = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      console.log("User not found");
      return { success: false };
    }
    
    const userData = userSnap.data();
    const today = new Date();
    const todayDate = today.toDateString();
    
    // Get last login date
    const lastLogin = userData.lastLogin ? new Date(userData.lastLogin) : null;
    const lastLoginDate = lastLogin ? lastLogin.toDateString() : null;
    
    // Calculate yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.toDateString();
    
    let newStreak = userData.streak || 0;
    
    console.log("Streak Debug:", { 
      lastLoginDate, 
      todayDate, 
      yesterdayDate,
      currentStreak: newStreak 
    });
    
    // If no last login, start streak at 1
    if (!lastLoginDate) {
      newStreak = 1;
      console.log("First login - streak: 1");
    }
    // If already logged in today, keep streak same
    else if (lastLoginDate === todayDate) {
      console.log("Already logged in today - streak unchanged:", newStreak);
      await updateDoc(userRef, {
        lastLogin: today.toISOString()
      });
      return { success: true, streak: newStreak };
    }
    // If logged in yesterday, increase streak
    else if (lastLoginDate === yesterdayDate) {
      newStreak += 1;
      console.log("Consecutive day - new streak:", newStreak);
    }
    // If last login is older, reset streak
    else {
      newStreak = 1;
      console.log("Streak broken - reset to 1");
    }
    
    // Update user document
    await updateDoc(userRef, {
      streak: newStreak,
      lastLogin: today.toISOString()
    });
    
    // Check streak achievements
    if (newStreak === 7) {
      await awardAchievement(userId, "streak_7");
    } else if (newStreak === 30) {
      await awardAchievement(userId, "streak_30");
    }
    
    console.log("Streak updated to:", newStreak);
    return { success: true, streak: newStreak };
    
  } catch (error) {
    console.error("Error updating streak:", error);
    return { success: false, error: error.message };
  }
};

// ---------- COURSES FUNCTIONS ----------
// Get user's enrolled courses with progress
export const getUserCourses = async (userId) => {
  try {
    const q = query(
      collection(db, "userCourses"), 
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const courses = [];
    querySnapshot.forEach((doc) => {
      courses.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: courses };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update course progress (when user watches a video)
export const updateCourseProgress = async (userId, courseId, courseTitle, language, completedVideos, totalVideos) => {
  try {
    // ✅ FIX: Validate values
    const validTotal = Math.max(totalVideos, 1);
    const validCompleted = Math.min(completedVideos, validTotal);
    const percentage = Math.round((validCompleted / validTotal) * 100);
    
    console.log(`📊 Validated: ${validCompleted}/${validTotal} = ${percentage}%`);
    
    const progressId = `${userId}_${courseId}`;
    const status = validCompleted === validTotal ? "completed" : "in_progress";
    
    await setDoc(doc(db, "userCourses", progressId), {
      userId,
      courseId,
      courseTitle,
      language,
      completedVideos: validCompleted,
      totalVideos: validTotal,
      percentage,
      status,
      lastWatched: new Date().toISOString()
    });
    
    console.log("✅ Course progress saved!");
    
    // ✅ Add points for watching a video (5 points per video)
    await updateUserPoints(userId, 5);
    console.log("✅ +5 points added!");
    
    // ✅ UPDATE LANGUAGE PROGRESS - FIXED
    console.log("🔄 Updating language progress for:", language);
    const langResult = await updateLanguageProgress(userId, language);
    console.log("✅ Language progress result:", langResult);
    
    // If course completed, add bonus points
    if (status === "completed") {
      await updateUserPoints(userId, 100);
      await awardAchievement(userId, "course_complete");
      console.log("✅ Course completed! +100 bonus points!");
    }
    
    return { success: true, percentage };
  } catch (error) {
    console.error("❌ Error updating course progress:", error);
    return { success: false, error: error.message };
  }
};

// Get total enrolled courses count
export const getTotalCoursesCount = async (userId) => {
  const result = await getUserCourses(userId);
  if (result.success) {
    return result.data.length;
  }
  return 0;
};

// Get completed courses count
export const getCompletedCoursesCount = async (userId) => {
  const result = await getUserCourses(userId);
  if (result.success) {
    return result.data.filter(c => c.status === "completed").length;
  }
  return 0;
};

// ---------- CODE SNIPPETS FUNCTIONS ----------
export const saveCodeSnippet = async (userId, title, language, code, output = "") => {
  try {
    const docRef = await addDoc(collection(db, "userCodes"), {
      userId,
      title: title || `${language.toUpperCase()} Snippet`,
      language,
      code,
      output,
      createdAt: new Date().toISOString(),
      lastEdited: new Date().toISOString()
    });
    
    // Update total codes count in user profile
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      totalCodes: increment(1)
    });
    
    // Add points for saving code (10 points)
    await updateUserPoints(userId, 10);
    
    // Check first code achievement
    const codesResult = await getUserCodes(userId);
    if (codesResult.success && codesResult.data.length === 1) {
      await awardAchievement(userId, "first_code");
    }
    if (codesResult.success && codesResult.data.length === 10) {
      await awardAchievement(userId, "code_master");
    }
    
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUserCodes = async (userId) => {
  try {
    const q = query(
      collection(db, "userCodes"), 
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const codes = [];
    querySnapshot.forEach((doc) => {
      codes.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: codes };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getTotalCodesCount = async (userId) => {
  const result = await getUserCodes(userId);
  if (result.success) {
    return result.data.length;
  }
  return 0;
};

// ---------- ACHIEVEMENTS FUNCTIONS ----------
export const achievementsList = {
  first_code: { title: "First Code", points: 50, icon: "🎯", description: "Wrote first line of code" },
  code_master: { title: "Code Master", points: 200, icon: "👨‍💻", description: "Saved 10 code snippets" },
  streak_7: { title: "Weekly Warrior", points: 100, icon: "🔥", description: "7 day streak" },
  streak_30: { title: "Monthly Legend", points: 500, icon: "⭐", description: "30 day streak" },
  course_complete: { title: "Course Master", points: 100, icon: "📚", description: "Completed first course" },
  html_master: { title: "HTML Master", points: 150, icon: "🌐", description: "Completed all HTML courses" },
  css_master: { title: "CSS Master", points: 150, icon: "🎨", description: "Completed all CSS courses" },
  js_master: { title: "JS Master", points: 150, icon: "⚡", description: "Completed all JavaScript courses" },
  py_master: { title: "Python Master", points: 150, icon: "🐍", description: "Completed all Python courses" },
  csharp_master: { title: "C# Master", points: 150, icon: "🔷", description: "Completed all C# courses" },
  cpp_master: { title: "C++ Master", points: 150, icon: "⚙️", description: "Completed all C++ courses" },
  points_500: { title: "Point Collector", points: 0, icon: "💰", description: "Earned 500 points" },
  points_1000: { title: "Elite Coder", points: 0, icon: "🏆", description: "Earned 1000 points" }
};

export const awardAchievement = async (userId, achievementId) => {
  try {
    const achievementKey = `${userId}_${achievementId}`;
    const achievementRef = doc(db, "userAchievements", achievementKey);
    const achievementSnap = await getDoc(achievementRef);
    
    if (!achievementSnap.exists() && achievementsList[achievementId]) {
      const achievement = achievementsList[achievementId];
      await setDoc(achievementRef, {
        userId,
        achievementId,
        title: achievement.title,
        description: achievement.description,
        icon: achievement.icon,
        points: achievement.points,
        earnedAt: new Date().toISOString()
      });
      
      if (achievement.points > 0) {
        await updateUserPoints(userId, achievement.points);
      }
      
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUserAchievements = async (userId) => {
  try {
    const q = query(
      collection(db, "userAchievements"), 
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const achievements = [];
    querySnapshot.forEach((doc) => {
      achievements.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: achievements };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ---------- REAL-TIME SUBSCRIPTIONS ----------
export const subscribeToUserData = (userId, callback) => {
  const userRef = doc(db, "users", userId);
  return onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    }
  });
};

export const subscribeToUserCourses = (userId, callback) => {
  const q = query(collection(db, "userCourses"), where("userId", "==", userId));
  return onSnapshot(q, (snapshot) => {
    const courses = [];
    snapshot.forEach((doc) => {
      courses.push({ id: doc.id, ...doc.data() });
    });
    callback(courses);
  });
};

export const subscribeToUserCodes = (userId, callback) => {
  const q = query(
    collection(db, "userCodes"), 
    where("userId", "==", userId),
    // orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    const codes = [];
    snapshot.forEach((doc) => {
      codes.push({ id: doc.id, ...doc.data() });
    });
     codes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); 
    callback(codes);
  });
};

export const subscribeToUserAchievements = (userId, callback) => {
  const q = query(collection(db, "userAchievements"), where("userId", "==", userId));
  return onSnapshot(q, (snapshot) => {
    const achievements = [];
    snapshot.forEach((doc) => {
      achievements.push({ id: doc.id, ...doc.data() });
    });
    callback(achievements);
  });
};