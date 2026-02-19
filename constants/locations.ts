export interface LocationData {
  divisions: Division[];
}

export interface Division {
  id: string;
  name: string;
  nameBn: string;
  districts: District[];
}

export interface District {
  id: string;
  name: string;
  nameBn: string;
  upazilas: Upazila[];
}

export interface Upazila {
  id: string;
  name: string;
  nameBn: string;
}

export const DIVISIONS: Division[] = [
  {
    id: 'dhaka',
    name: 'Dhaka',
    nameBn: 'ঢাকা',
    districts: [
      {
        id: 'dhaka-city',
        name: 'Dhaka',
        nameBn: 'ঢাকা',
        upazilas: [
          { id: 'gulshan', name: 'Gulshan', nameBn: 'গুলশান' },
          { id: 'banani', name: 'Banani', nameBn: 'বনানী' },
          { id: 'dhanmondi', name: 'Dhanmondi', nameBn: 'ধানমন্ডি' },
          { id: 'uttara', name: 'Uttara', nameBn: 'উত্তরা' },
          { id: 'mirpur', name: 'Mirpur', nameBn: 'মিরপুর' },
          { id: 'mohammadpur', name: 'Mohammadpur', nameBn: 'মোহাম্মদপুর' },
          { id: 'bashundhara', name: 'Bashundhara', nameBn: 'বসুন্ধরা' },
          { id: 'motijheel', name: 'Motijheel', nameBn: 'মতিঝিল' },
          { id: 'tejgaon', name: 'Tejgaon', nameBn: 'তেজগাঁও' },
          { id: 'badda', name: 'Badda', nameBn: 'বাড্ডা' },
          { id: 'rampura', name: 'Rampura', nameBn: 'রামপুরা' },
          { id: 'khilgaon', name: 'Khilgaon', nameBn: 'খিলগাঁও' },
        ],
      },
      {
        id: 'gazipur',
        name: 'Gazipur',
        nameBn: 'গাজীপুর',
        upazilas: [
          { id: 'gazipur-sadar', name: 'Gazipur Sadar', nameBn: 'গাজীপুর সদর' },
          { id: 'tongi', name: 'Tongi', nameBn: 'টঙ্গী' },
          { id: 'kaliakair', name: 'Kaliakair', nameBn: 'কালিয়াকৈর' },
        ],
      },
      {
        id: 'narayanganj',
        name: 'Narayanganj',
        nameBn: 'নারায়ণগঞ্জ',
        upazilas: [
          { id: 'narayanganj-sadar', name: 'Narayanganj Sadar', nameBn: 'নারায়ণগঞ্জ সদর' },
          { id: 'siddhirganj', name: 'Siddhirganj', nameBn: 'সিদ্ধিরগঞ্জ' },
        ],
      },
    ],
  },
  {
    id: 'chattogram',
    name: 'Chattogram',
    nameBn: 'চট্টগ্রাম',
    districts: [
      {
        id: 'chattogram-city',
        name: 'Chattogram',
        nameBn: 'চট্টগ্রাম',
        upazilas: [
          { id: 'agrabad', name: 'Agrabad', nameBn: 'আগ্রাবাদ' },
          { id: 'nasirabad', name: 'Nasirabad', nameBn: 'নাসিরাবাদ' },
          { id: 'pahartali', name: 'Pahartali', nameBn: 'পাহাড়তলী' },
          { id: 'halishahar', name: 'Halishahar', nameBn: 'হালিশহর' },
        ],
      },
      {
        id: 'coxs-bazar',
        name: "Cox's Bazar",
        nameBn: 'কক্সবাজার',
        upazilas: [
          { id: 'coxs-bazar-sadar', name: "Cox's Bazar Sadar", nameBn: 'কক্সবাজার সদর' },
        ],
      },
    ],
  },
  {
    id: 'rajshahi',
    name: 'Rajshahi',
    nameBn: 'রাজশাহী',
    districts: [
      {
        id: 'rajshahi-city',
        name: 'Rajshahi',
        nameBn: 'রাজশাহী',
        upazilas: [
          { id: 'rajshahi-sadar', name: 'Rajshahi Sadar', nameBn: 'রাজশাহী সদর' },
          { id: 'boalia', name: 'Boalia', nameBn: 'বোয়ালিয়া' },
        ],
      },
    ],
  },
  {
    id: 'khulna',
    name: 'Khulna',
    nameBn: 'খুলনা',
    districts: [
      {
        id: 'khulna-city',
        name: 'Khulna',
        nameBn: 'খুলনা',
        upazilas: [
          { id: 'khulna-sadar', name: 'Khulna Sadar', nameBn: 'খুলনা সদর' },
          { id: 'daulatpur', name: 'Daulatpur', nameBn: 'দৌলতপুর' },
        ],
      },
    ],
  },
  {
    id: 'sylhet',
    name: 'Sylhet',
    nameBn: 'সিলেট',
    districts: [
      {
        id: 'sylhet-city',
        name: 'Sylhet',
        nameBn: 'সিলেট',
        upazilas: [
          { id: 'sylhet-sadar', name: 'Sylhet Sadar', nameBn: 'সিলেট সদর' },
          { id: 'south-surma', name: 'South Surma', nameBn: 'দক্ষিণ সুরমা' },
        ],
      },
    ],
  },
  {
    id: 'rangpur',
    name: 'Rangpur',
    nameBn: 'রংপুর',
    districts: [
      {
        id: 'rangpur-city',
        name: 'Rangpur',
        nameBn: 'রংপুর',
        upazilas: [
          { id: 'rangpur-sadar', name: 'Rangpur Sadar', nameBn: 'রংপুর সদর' },
        ],
      },
    ],
  },
  {
    id: 'barishal',
    name: 'Barishal',
    nameBn: 'বরিশাল',
    districts: [
      {
        id: 'barishal-city',
        name: 'Barishal',
        nameBn: 'বরিশাল',
        upazilas: [
          { id: 'barishal-sadar', name: 'Barishal Sadar', nameBn: 'বরিশাল সদর' },
        ],
      },
    ],
  },
  {
    id: 'mymensingh',
    name: 'Mymensingh',
    nameBn: 'ময়মনসিংহ',
    districts: [
      {
        id: 'mymensingh-city',
        name: 'Mymensingh',
        nameBn: 'ময়মনসিংহ',
        upazilas: [
          { id: 'mymensingh-sadar', name: 'Mymensingh Sadar', nameBn: 'ময়মনসিংহ সদর' },
        ],
      },
    ],
  },
];

export const PROPERTY_TYPES = [
  { id: 'apartment', name: 'Apartment', nameBn: 'এপার্টমেন্ট', icon: 'business' as const },
  { id: 'house', name: 'House', nameBn: 'বাড়ি', icon: 'home' as const },
  { id: 'sublet', name: 'Sublet', nameBn: 'সাবলেট', icon: 'bed' as const },
  { id: 'office', name: 'Office', nameBn: 'অফিস', icon: 'briefcase' as const },
  { id: 'shop', name: 'Shop', nameBn: 'দোকান', icon: 'storefront' as const },
  { id: 'mess', name: 'Mess/Hostel', nameBn: 'মেস/হোস্টেল', icon: 'people' as const },
];

export const FURNISHING_OPTIONS = [
  { id: 'furnished', name: 'Furnished', nameBn: 'ফার্নিশড' },
  { id: 'semi-furnished', name: 'Semi-Furnished', nameBn: 'সেমি-ফার্নিশড' },
  { id: 'unfurnished', name: 'Unfurnished', nameBn: 'আনফার্নিশড' },
];

export const GENDER_PREFERENCES = [
  { id: 'any', name: 'Any', nameBn: 'যেকেউ' },
  { id: 'male', name: 'Male Only', nameBn: 'শুধু পুরুষ' },
  { id: 'female', name: 'Female Only', nameBn: 'শুধু মহিলা' },
  { id: 'family', name: 'Family', nameBn: 'পরিবার' },
];
