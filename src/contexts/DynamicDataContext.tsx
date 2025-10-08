import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  fetchAndCacheData, 
  getCategoryIdsByType, 
  Language, 
  State, 
  District, 
  Category 
} from '../utils/dynamicDataUtils';
import { fetchUrgencyPatterns, fetchCategoryKeywords } from '../services/api';

interface DynamicDataContextType {
  // Data arrays
  languages: Language[];
  states: State[];
  districts: District[];
  categories: Category[];
  urgencyPatterns: Record<string, string[]>;
  categoryKeywords: Record<string, Record<string, string[]>>;
  
  // Selected values
  selectedLanguage: Language | null;
  selectedState: State | null;
  selectedDistrict: District | null;
  selectedCategories: Category[];
  
  // Loading states
  loadingLanguages: boolean;
  loadingStates: boolean;
  loadingDistricts: boolean;
  loadingCategories: boolean;
  loadingUrgencyPatterns: boolean;
  loadingCategoryKeywords: boolean;
  
  // Error states
  errorLanguages: string | null;
  errorStates: string | null;
  errorDistricts: string | null;
  errorCategories: string | null;
  errorUrgencyPatterns: string | null;
  errorCategoryKeywords: string | null;
  
  // Setters
  setLanguage: (language: Language | null) => void;
  setState: (state: State | null) => void;
  setDistrict: (district: District | null) => void;
  setSelectedCategories: (categories: Category[]) => void;
  
  // Utility functions
  getCurrentLanguageId: () => string | null;
  getCurrentStateId: () => string | null;
  getCurrentDistrictId: () => string | null;
  getCurrentCategoryIds: () => string[];
  getCategoryIdsByType: (type: string) => string[];
  
  // Reset function
  resetToDefaults: () => void;
  
  // Set default selections function
  setDefaultSelections: () => void;
  
  // Refresh functions
  refreshLanguages: () => void;
  refreshStates: () => void;
  refreshDistricts: () => void;
  refreshCategories: () => void;
  refreshUrgencyPatterns: () => void;
  refreshCategoryKeywords: () => void;
}

const DynamicDataContext = createContext<DynamicDataContextType | undefined>(undefined);

export const useDynamicData = () => {
  const context = useContext(DynamicDataContext);
  if (context === undefined) {
    throw new Error('useDynamicData must be used within a DynamicDataProvider');
  }
  return context;
};

interface DynamicDataProviderProps {
  children: ReactNode;
}

export const DynamicDataProvider: React.FC<DynamicDataProviderProps> = ({ children }) => {
  // Global state for selections (managed by Header component)
  const [selectedLanguage, setSelectedLanguage] = React.useState<Language | null>(null);
  const [selectedState, setSelectedState] = React.useState<State | null>(null);
  const [selectedDistrict, setSelectedDistrict] = React.useState<District | null>(null);
  const [selectedCategories, setSelectedCategories] = React.useState<Category[]>([]);

  // Languages query
  const {
    data: languages = [],
    isLoading: loadingLanguages,
    error: errorLanguages,
    refetch: refreshLanguages
  } = useQuery({
    queryKey: ['languages'],
    queryFn: () => fetchAndCacheData<Language>('/news/languages', {}, 'languages'),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  // States query - depends on selectedLanguage
  const {
    data: states = [],
    isLoading: loadingStates,
    error: errorStates,
    refetch: refreshStates
  } = useQuery({
    queryKey: ['states', selectedLanguage?.id],
    queryFn: () => fetchAndCacheData<State>('/news/states', { language_id: selectedLanguage?.id }, 'states'),
    enabled: !!selectedLanguage?.id,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });

  // Districts query - depends on selectedLanguage and selectedState
  const {
    data: districts = [],
    isLoading: loadingDistricts,
    error: errorDistricts,
    refetch: refreshDistricts
  } = useQuery({
    queryKey: ['districts', selectedLanguage?.id, selectedState?.id],
    queryFn: () => fetchAndCacheData<District>('/news/districts', { 
      language_id: selectedLanguage?.id, 
      state_id: selectedState?.id 
    }, 'districts'),
    enabled: !!selectedLanguage?.id && !!selectedState?.id,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });

  // Categories query - depends on selectedLanguage
  const {
    data: categories = [],
    isLoading: loadingCategories,
    error: errorCategories,
    refetch: refreshCategories
  } = useQuery({
    queryKey: ['categories', selectedLanguage?.id],
    queryFn: () => fetchAndCacheData<Category>('/news/categories', { language_id: selectedLanguage?.id }, 'categories'),
    enabled: !!selectedLanguage?.id,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });

  // Urgency patterns query - independent of language selection
  const {
    data: urgencyPatterns = {},
    isLoading: loadingUrgencyPatterns,
    error: errorUrgencyPatterns,
    refetch: refreshUrgencyPatterns
  } = useQuery({
    queryKey: ['urgency-patterns'],
    queryFn: () => fetchUrgencyPatterns(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 24 * 60 * 60 * 1000, // 24 hours (changed from cacheTime)
  });

  // Category keywords query - independent of language selection
  const {
    data: categoryKeywords = {},
    isLoading: loadingCategoryKeywords,
    error: errorCategoryKeywords,
    refetch: refreshCategoryKeywords
  } = useQuery({
    queryKey: ['category-keywords'],
    queryFn: () => fetchCategoryKeywords(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 24 * 60 * 60 * 1000, // 24 hours (changed from cacheTime)
  });

  // Debug category keywords
  React.useEffect(() => {
    console.log('[DynamicDataContext] Category keywords loaded:', {
      categoryKeywords,
      loadingCategoryKeywords,
      errorCategoryKeywords,
      keys: Object.keys(categoryKeywords)
    });
  }, [categoryKeywords, loadingCategoryKeywords, errorCategoryKeywords]);

  // Debug urgency patterns
  React.useEffect(() => {
    console.log('[DynamicDataContext] Urgency patterns loaded:', {
      urgencyPatterns,
      loadingUrgencyPatterns,
      errorUrgencyPatterns,
      keys: Object.keys(urgencyPatterns)
    });
  }, [urgencyPatterns, loadingUrgencyPatterns, errorUrgencyPatterns]);

  // Debug categories for current language
  React.useEffect(() => {
    if (selectedLanguage && categories.length > 0) {
      console.log('[DynamicDataContext] Categories for current language:', {
        language: selectedLanguage.language_name,
        languageId: selectedLanguage.id,
        categoriesCount: categories.length,
        categories: categories.map(cat => ({
          id: cat.id,
          name: cat.category_name,
          slug: cat.slug,
          language_id: cat.language_id
        }))
      });
    }
  }, [selectedLanguage, categories]);

  // Load saved selections from session storage on mount
  React.useEffect(() => {
    const savedLanguage = sessionStorage.getItem('selectedLanguage');
    const savedState = sessionStorage.getItem('selectedState');
    const savedDistrict = sessionStorage.getItem('selectedDistrict');
    const savedCategories = sessionStorage.getItem('selectedCategories');

    if (savedLanguage) {
      try {
        const parsed = JSON.parse(savedLanguage);
        setSelectedLanguage(parsed);
        console.log('[DynamicData] Loaded saved language:', parsed.language_name);
      } catch (error) {
        console.error('Error parsing saved language:', error);
      }
    }

    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setSelectedState(parsed);
        console.log('[DynamicData] Loaded saved state:', parsed.state_name);
      } catch (error) {
        console.error('Error parsing saved state:', error);
      }
    }

    if (savedDistrict) {
      try {
        const parsed = JSON.parse(savedDistrict);
        setSelectedDistrict(parsed);
        console.log('[DynamicData] Loaded saved district:', parsed.name);
      } catch (error) {
        console.error('Error parsing saved district:', error);
      }
    }

    if (savedCategories) {
      try {
        const parsed = JSON.parse(savedCategories);
        setSelectedCategories(parsed);
        console.log('[DynamicData] Loaded saved categories:', parsed.length);
      } catch (error) {
        console.error('Error parsing saved categories:', error);
      }
    }
  }, []);

  // Initialize with default language on first load if no saved selection
  React.useEffect(() => {
    if (languages.length > 0 && !selectedLanguage) {
      console.log('[DynamicData] Available languages:', languages.map(l => l.language_name));
      // Try to find English first, fallback to first available
      const defaultLang = languages.find(lang => 
        lang.language_name.toLowerCase().includes('english') || 
        lang.language_code.toLowerCase() === 'en' ||
        lang.language_name.toLowerCase() === 'english'
      ) || languages[0];
      
      if (defaultLang) {
        setSelectedLanguage(defaultLang);
        console.log('[DynamicData] Auto-selected default language:', defaultLang.language_name, 'ID:', defaultLang.id);
      }
    }
  }, [languages, selectedLanguage]);

  // Initialize with default state when language is selected
  React.useEffect(() => {
    if (states.length > 0 && !selectedState && selectedLanguage) {
      console.log('[DynamicData] Available states:', states.map(s => s.state_name));
      // Try to find Telangana first, fallback to first available
      const defaultState = states.find(state => 
        state.state_name.toLowerCase().includes('telangana') ||
        state.state_name.toLowerCase() === 'telangana' ||
        state.state_name.toLowerCase().includes('తెలంగాణ') ||
        state.state_name.toLowerCase().includes('தெலுங்கானா') ||
        state.state_name.toLowerCase().includes('ತೆಲಂಗಾಣ') ||
        state.state_name.toLowerCase().includes('तेलंगाना')
      ) || states[0];
      
      if (defaultState) {
        setSelectedState(defaultState);
        console.log('[DynamicData] Auto-selected default state:', defaultState.state_name, 'ID:', defaultState.id);
      }
    }
  }, [states, selectedLanguage, selectedState]);

  // Initialize with default district when state is selected
  React.useEffect(() => {
    if (districts.length > 0 && !selectedDistrict && selectedState) {
      console.log('[DynamicData] Available districts:', districts.map(d => d.name));
      // Try to find Hyderabad first, fallback to first available
      const defaultDistrict = districts.find(district => 
        district.name.toLowerCase().includes('hyderabad') ||
        district.name.toLowerCase() === 'hyderabad' ||
        district.name.toLowerCase().includes('హైదరాబాద్') ||
        district.name.toLowerCase().includes('ஹைதராபாத்') ||
        district.name.toLowerCase().includes('ಹೈದರಾಬಾದ್') ||
        district.name.toLowerCase().includes('हैदराबाद')
      ) || districts[0];
      
      if (defaultDistrict) {
        setSelectedDistrict(defaultDistrict);
        console.log('[DynamicData] Auto-selected default district:', defaultDistrict.name, 'ID:', defaultDistrict.id);
      }
    }
  }, [districts, selectedState, selectedDistrict]);

  // Save selections to session storage when they change
  React.useEffect(() => {
    if (selectedLanguage) {
      sessionStorage.setItem('selectedLanguage', JSON.stringify(selectedLanguage));
    }
  }, [selectedLanguage]);

  React.useEffect(() => {
    if (selectedState) {
      sessionStorage.setItem('selectedState', JSON.stringify(selectedState));
    }
  }, [selectedState]);

  React.useEffect(() => {
    if (selectedDistrict) {
      sessionStorage.setItem('selectedDistrict', JSON.stringify(selectedDistrict));
    }
  }, [selectedDistrict]);

  React.useEffect(() => {
    if (selectedCategories.length > 0) {
      sessionStorage.setItem('selectedCategories', JSON.stringify(selectedCategories));
    }
  }, [selectedCategories]);

  // Utility functions
  const getCurrentLanguageId = () => selectedLanguage?.id || null;
  const getCurrentStateId = () => selectedState?.id || null;
  const getCurrentDistrictId = () => selectedDistrict?.id || null;
  const getCurrentCategoryIds = () => selectedCategories.map(cat => cat.id);
  const getCategoryIdsByTypeHelper = (type: string) => getCategoryIdsByType(categories, type, urgencyPatterns, categoryKeywords, selectedLanguage?.id, languages);
  
  // Reset to defaults function
  const resetToDefaults = () => {
    console.log('[DynamicData] Resetting to defaults...');
    // Clear session storage
    sessionStorage.removeItem('selectedLanguage');
    sessionStorage.removeItem('selectedState');
    sessionStorage.removeItem('selectedDistrict');
    sessionStorage.removeItem('selectedCategories');
    
    // Reset state
    setSelectedLanguage(null);
    setSelectedState(null);
    setSelectedDistrict(null);
    setSelectedCategories([]);
    
    // Set default selections after a short delay to ensure state is reset
    setTimeout(() => {
      if (languages.length > 0 && states.length > 0 && districts.length > 0) {
        setDefaultSelections();
      }
    }, 100);
    
    console.log('[DynamicData] Reset to defaults completed');
  };

  // Set default selections function (English, Telangana, Hyderabad)
  const setDefaultSelections = React.useCallback(() => {
    console.log('[DynamicData] Setting default selections...');
    
    // Set default language (English)
    if (languages.length > 0) {
      const englishLang = languages.find(lang => 
        lang.language_name.toLowerCase().includes('english') || 
        lang.language_code.toLowerCase() === 'en' ||
        lang.language_name.toLowerCase() === 'english'
      );
      if (englishLang) {
        setSelectedLanguage(englishLang);
        console.log('[DynamicData] Set default language to English');
      }
    }
    
    // Set default state (Telangana)
    if (states.length > 0) {
      const telanganaState = states.find(state => 
        state.state_name.toLowerCase().includes('telangana') ||
        state.state_name.toLowerCase() === 'telangana' ||
        state.state_name.toLowerCase().includes('తెలంగాణ') ||
        state.state_name.toLowerCase().includes('தெலுங்கானா') ||
        state.state_name.toLowerCase().includes('ತೆಲಂಗಾಣ') ||
        state.state_name.toLowerCase().includes('तेलंगाना')
      );
      if (telanganaState) {
        setSelectedState(telanganaState);
        console.log('[DynamicData] Set default state to Telangana');
      }
    }
    
    // Set default district (Hyderabad)
    if (districts.length > 0) {
      const hyderabadDistrict = districts.find(district => 
        district.name.toLowerCase().includes('hyderabad') ||
        district.name.toLowerCase() === 'hyderabad' ||
        district.name.toLowerCase().includes('హైదరాబాద్') ||
        district.name.toLowerCase().includes('ஹைதராபாத்') ||
        district.name.toLowerCase().includes('ಹೈದರಾಬಾದ್') ||
        district.name.toLowerCase().includes('हैदराबाद')
      );
      if (hyderabadDistrict) {
        setSelectedDistrict(hyderabadDistrict);
        console.log('[DynamicData] Set default district to Hyderabad');
      }
    }
  }, [languages, states, districts]);

  // Set default selections on page load if no saved selections exist
  React.useEffect(() => {
    const hasSavedSelections = sessionStorage.getItem('selectedLanguage') || 
                              sessionStorage.getItem('selectedState') || 
                              sessionStorage.getItem('selectedDistrict');
    
    if (!hasSavedSelections && languages.length > 0 && states.length > 0 && districts.length > 0) {
      console.log('[DynamicData] No saved selections found, setting default selections...');
      setDefaultSelections();
    }
  }, [languages, states, districts, setDefaultSelections]);

  // Context value
  const contextValue: DynamicDataContextType = {
    // Data arrays
    languages,
    states,
    districts,
    categories,
    urgencyPatterns,
    categoryKeywords,
    
    // Selected values
    selectedLanguage,
    selectedState,
    selectedDistrict,
    selectedCategories,
    
    // Loading states
    loadingLanguages,
    loadingStates,
    loadingDistricts,
    loadingCategories,
    loadingUrgencyPatterns,
    loadingCategoryKeywords,
    
    // Error states
    errorLanguages: errorLanguages?.message || null,
    errorStates: errorStates?.message || null,
    errorDistricts: errorDistricts?.message || null,
    errorCategories: errorCategories?.message || null,
    errorUrgencyPatterns: errorUrgencyPatterns?.message || null,
    errorCategoryKeywords: errorCategoryKeywords?.message || null,
    
    // Setters
    setLanguage: setSelectedLanguage,
    setState: setSelectedState,
    setDistrict: setSelectedDistrict,
    setSelectedCategories,
    
    // Utility functions
    getCurrentLanguageId,
    getCurrentStateId,
    getCurrentDistrictId,
    getCurrentCategoryIds,
    getCategoryIdsByType: getCategoryIdsByTypeHelper,
    
    // Reset function
    resetToDefaults,
    
    // Set default selections function
    setDefaultSelections,
    
    // Refresh functions
    refreshLanguages,
    refreshStates,
    refreshDistricts,
    refreshCategories,
    refreshUrgencyPatterns,
    refreshCategoryKeywords,
  };

  return (
    <DynamicDataContext.Provider value={contextValue}>
      {children}
    </DynamicDataContext.Provider>
  );
};