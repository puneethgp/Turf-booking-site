import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { 
  Wifi, 
  Flame, 
  Droplet, 
  Lock, 
  Car, 
  Coffee, 
  Sparkles, 
  MapPin, 
  Calendar as CalendarIcon, 
  Clock,
  UserCheck,
  UserX,
  Share2,
  Trophy,
  Play,
  Layers,
  ChevronDown,
  ChevronUp,
  LogOut,
  User,
  Plus,
  Shield,
  Link as LinkIcon,
  Search,
  Check
} from 'lucide-react'
import cricketBg from './assets/cricket.png'
import footballBg from './assets/football.png'
import othersBg from './assets/others.png'
import cricketSlotBg from './assets/cricket_slot_bg.png'
import footballSlotBg from './assets/football_slot_bg.png'
import { supabase, isSupabaseConfigured } from './supabaseClient'

const sports = [
  {
    id: 'cricket',
    title: 'Cricket Arena',
    tag: 'Clay & Grass Pitches',
    desc: 'Book professional pitches. Organize box cricket matches with live scorecard tracking.',
    bg: cricketBg,
    className: 'cricket',
    facilities: ['Premium Clay Pitch', 'Leather Ball Friendly', 'Changing Rooms', 'Floodlights', 'Cafe Access']
  },
  {
    id: 'football',
    title: 'Football Turf',
    tag: 'FIFA Approved AstroTurf',
    desc: 'Premium 5-a-side and 7-a-side arenas with dynamic floodlights. Join local matches and tournaments.',
    bg: footballBg,
    className: 'football',
    facilities: ['AstroTurf Pitch', 'Floodlights', 'Free Parking', 'Showers', 'Cafe Lounge']
  },
  {
    id: 'others',
    title: 'Multi-Sport Court',
    tag: 'Hockey & More',
    desc: 'Multi-sport fields optimized for Hockey, Volleyball, and Indoor Badminton.',
    bg: othersBg,
    className: 'others',
    facilities: ['Indoor Multi-Turf', 'Equipment Rentals', 'Drinking Water', 'Spectator Stand', 'Restrooms']
  }
]

function App() {
  // Navigation & View States
  const [selectedSport, setSelectedSport] = useState(() => {
    return localStorage.getItem('sr_selectedSport') || null
  })
  const [selectedTurf, setSelectedTurf] = useState(() => {
    const val = localStorage.getItem('sr_selectedTurf')
    return val ? parseInt(val, 10) : 1
  })
  const [selectedDateIndex, setSelectedDateIndex] = useState(0)

  const activeSport = useMemo(() => {
    return sports.find(s => s.id === selectedSport)
  }, [selectedSport])
  
  // Auth state
  const [currentUser, setCurrentUser] = useState(() => {
    const val = localStorage.getItem('sr_currentUser')
    return val ? JSON.parse(val) : null
  })
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const val = localStorage.getItem('sr_currentUser')
    return !!val && localStorage.getItem('sr_isLoggedIn') === 'true'
  })
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [authTab, setAuthTab] = useState('login') // 'login' or 'register'
  const [viewingDashboard, setViewingDashboard] = useState(() => {
    return localStorage.getItem('sr_viewingDashboard') === 'true'
  })

  // Sync state to localStorage on changes
  useEffect(() => {
    if (selectedSport) {
      localStorage.setItem('sr_selectedSport', selectedSport)
    } else {
      localStorage.removeItem('sr_selectedSport')
    }
  }, [selectedSport])

  useEffect(() => {
    localStorage.setItem('sr_selectedTurf', selectedTurf.toString())
  }, [selectedTurf])

  useEffect(() => {
    localStorage.setItem('sr_isLoggedIn', isLoggedIn.toString())
  }, [isLoggedIn])

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sr_currentUser', JSON.stringify(currentUser))
    } else {
      localStorage.removeItem('sr_currentUser')
    }
  }, [currentUser])

  useEffect(() => {
    localStorage.setItem('sr_viewingDashboard', viewingDashboard.toString())
  }, [viewingDashboard])

  const [expandedDayIndex, setExpandedDayIndex] = useState(null)

  // System Configuration (Floodlights peak timing set by Owner)
  const [floodlightStartHour, setFloodlightStartHour] = useState(19) // default 7 PM (19:00)


  // Register Fields
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regRole, setRegRole] = useState('player')
  const [isExistingPlayerToggle, setIsExistingPlayerToggle] = useState(false)
  const [playerSearchQuery, setPlayerSearchQuery] = useState('')
  const [selectedShadowProfile, setSelectedShadowProfile] = useState(null)

  // Default profiles seed data
  const defaultProfiles = [
    { id: 'p1', name: 'Rahul (Captain)', email: 'rahul.strikers@gmail.com', role: 'player', runs: 342, wickets: 12, matches: 14, isShadow: false },
    { id: 'p2', name: 'Vikram', email: 'vikram.play@yahoo.com', role: 'player', runs: 85, wickets: 3, matches: 5, isShadow: false },
    { id: 'p3', name: 'Amit (Owner)', email: 'amit.owner@smashnroast.com', role: 'owner', runs: 0, wickets: 0, matches: 0, isShadow: false },
    { id: 'p4', name: 'Super Admin', email: 'puneethgp18@gmail.com', role: 'admin', runs: 0, wickets: 0, matches: 0, isShadow: false },
    { id: 'shadow_1', name: 'Ramesh Offline', email: null, role: 'player', runs: 180, wickets: 6, matches: 8, isShadow: true, claimCode: 'SR-7B9A2' },
    { id: 'shadow_2', name: 'Sunil Shadow', email: null, role: 'player', runs: 95, wickets: 2, matches: 4, isShadow: true, claimCode: 'SR-4X1Y8' },
    { id: 'shadow_3', name: 'Deepak Rao', email: null, role: 'player', runs: 210, wickets: 8, matches: 9, isShadow: true, claimCode: 'SR-2M5N8' }
  ]

  // Profiles — persisted to localStorage
  const [profiles, setProfiles] = useState(() => {
    try {
      const saved = localStorage.getItem('sr_profiles')
      return saved ? JSON.parse(saved) : defaultProfiles
    } catch { return defaultProfiles }
  })

  // Default groups seed data
  const defaultGroups = [
    { id: 'g1', name: 'Strikers FC', creator: 'Rahul (Captain)', createdWhen: '2026-03-12', members: [
      { name: 'Rahul (Captain)', email: 'rahul.strikers@gmail.com', isShadow: false },
      { name: 'Amit Kumar', email: 'amit@gmail.com', isShadow: false },
      { name: 'Ramesh Offline', email: null, isShadow: true, claimCode: 'SR-7B9A2' },
      { name: 'Sunil Shadow', email: null, isShadow: true, claimCode: 'SR-4X1Y8' }
    ]},
    { id: 'g2', name: 'Royal Challengers', creator: 'Rahul (Captain)', createdWhen: '2026-04-18', members: [
      { name: 'Rahul (Captain)', email: 'rahul.strikers@gmail.com', isShadow: false },
      { name: 'Deepak Rao', email: null, isShadow: true, claimCode: 'SR-2M5N8' }
    ]},
    { id: 'g3', name: 'Vikram XI', creator: 'Vikram', createdWhen: '2026-05-10', members: [
      { name: 'Vikram', email: 'vikram.play@yahoo.com', isShadow: false },
      { name: 'Rahul (Captain)', email: 'rahul.strikers@gmail.com', isShadow: false }
    ]},
    { id: 'g4', name: 'Owners Club', creator: 'Amit (Owner)', createdWhen: '2026-06-01', members: [
      { name: 'Amit (Owner)', email: 'amit.owner@smashnroast.com', isShadow: false }
    ]},
    { id: 'g5', name: 'Super Admin FC', creator: 'Super Admin', createdWhen: '2026-06-05', members: [
      { name: 'Super Admin', email: 'puneethgp18@gmail.com', isShadow: false }
    ]}
  ]

  // Groups — persisted to localStorage
  const [groups, setGroups] = useState(() => {
    try {
      const saved = localStorage.getItem('sr_groups')
      return saved ? JSON.parse(saved) : defaultGroups
    } catch { return defaultGroups }
  })

  // Filter shadow profiles for search (players who do not have a email/gmail tagged)
  const availableShadowProfiles = useMemo(() => {
    return profiles.filter(p => p.isShadow && !p.email)
  }, [profiles])

  // Search filter for shadow profiles
  const filteredShadowProfiles = useMemo(() => {
    if (!playerSearchQuery) return []
    return availableShadowProfiles.filter(p => 
      p.name.toLowerCase().includes(playerSearchQuery.toLowerCase())
    )
  }, [playerSearchQuery, availableShadowProfiles])

  // Filter groups where the current user is a member
  const userGroupsList = useMemo(() => {
    if (!currentUser) return ['Individual Play']
    const myGroups = groups.filter(g => 
      g.creator === currentUser.name || 
      g.members.some(m => m.name === currentUser.name || (currentUser.email && m.email === currentUser.email))
    )
    return [...myGroups.map(g => g.name), 'Individual Play']
  }, [groups, currentUser])

  // Default bookings seed data
  const defaultBookings = [
    {
      id: 'b1',
      sportId: 'cricket',
      turfId: 1,
      dateIndex: 0,
      time: '08:00 AM',
      duration: 1,
      status: 'booked_private',
      teamName: 'Red Raptors CC',
      playerCount: 8,
      ownerApproved: true,
      openToJoin: false,
      captainName: 'Sanjay Kumar',
      joinRequests: [],
      scoreCard: null,
      requestedAt: '2026-06-08T18:30:15Z',
      matchPlayers: [
        { name: 'Sanjay Kumar', email: 'sanjay@gmail.com', isShadow: false, team: 1 },
        { name: 'Ramesh Offline', email: null, isShadow: true, team: 1 },
        { name: 'Deepak Rao', email: null, isShadow: true, team: 2 },
        { name: 'Sunil Shadow', email: null, isShadow: true, team: 2 }
      ]
    },
    {
      id: 'b2',
      sportId: 'football',
      turfId: 2,
      dateIndex: 0,
      time: '06:00 PM',
      duration: 2,
      status: 'booked_open',
      teamName: 'Strikers FC',
      playerCount: 6,
      ownerApproved: true,
      openToJoin: true,
      captainName: 'Rahul (Captain)',
      joinRequests: [
        { id: 'r1', playerName: 'Suresh Raina', email: 'suresh@yahoo.com', count: 2 }
      ],
      scoreCard: null,
      requestedAt: '2026-06-08T19:42:00Z',
      matchPlayers: [
        { name: 'Rahul (Captain)', email: 'rahul.strikers@gmail.com', isShadow: false, team: 1 },
        { name: 'Amit Kumar', email: 'amit@gmail.com', isShadow: false, team: 1 },
        { name: 'Ramesh Offline', email: null, isShadow: true, team: 2 },
        { name: 'Sunil Shadow', email: null, isShadow: true, team: 2 }
      ]
    },
    {
      id: 'b3',
      sportId: 'cricket',
      turfId: 1,
      dateIndex: 0,
      time: '04:00 PM',
      duration: 2,
      status: 'pending_approval',
      teamName: 'Gully Kings',
      playerCount: 8,
      ownerApproved: false,
      openToJoin: false,
      captainName: 'Sunil Shadow',
      joinRequests: [],
      scoreCard: null,
      requestedAt: '2026-06-08T14:10:00Z',
      matchPlayers: [
        { name: 'Sunil Shadow', email: null, isShadow: true, team: null },
        { name: 'Ramesh Offline', email: null, isShadow: true, team: null }
      ]
    },
    {
      id: 'b4',
      sportId: 'cricket',
      turfId: 1,
      dateIndex: 0,
      time: '04:00 PM',
      duration: 1,
      status: 'pending_approval',
      teamName: 'Red Raptors CC',
      playerCount: 8,
      ownerApproved: false,
      openToJoin: false,
      captainName: 'Sanjay Kumar',
      joinRequests: [],
      scoreCard: null,
      requestedAt: '2026-06-08T15:25:00Z',
      matchPlayers: [
        { name: 'Sanjay Kumar', email: 'sanjay@gmail.com', isShadow: false, team: null }
      ]
    },
    {
      id: 'b_past_1',
      sportId: 'cricket',
      turfId: 1,
      dateIndex: -1, // representing yesterday
      dateFormatted: 'Yesterday',
      time: '04:00 PM',
      duration: 2,
      status: 'completed',
      teamName: 'Royal Challengers',
      playerCount: 8,
      ownerApproved: true,
      openToJoin: false,
      captainName: 'Rahul (Captain)',
      joinRequests: [],
      scoreCard: {
        team1: 'Royal Challengers',
        team2: 'Super Giants',
        score1: '145/3',
        overs1: '12',
        score2: '132/6',
        overs2: '12',
        result: 'Royal Challengers won by 13 runs',
        isCompleted: true
      },
      requestedAt: '2026-06-07T12:00:00Z',
      matchPlayers: [
        { name: 'Rahul (Captain)', email: 'rahul.strikers@gmail.com', isShadow: false, team: 1 },
        { name: 'Deepak Rao', email: null, isShadow: true, team: 1 },
        { name: 'Vikram', email: 'vikram.play@yahoo.com', isShadow: false, team: 2 },
        { name: 'Ramesh Offline', email: null, isShadow: true, team: 2 }
      ]
    },
    {
      id: 'b_past_2',
      sportId: 'football',
      turfId: 2,
      dateIndex: -2, // representing 2 days ago
      dateFormatted: '2 days ago',
      time: '07:00 PM',
      duration: 1,
      status: 'completed',
      teamName: 'Strikers FC',
      playerCount: 6,
      ownerApproved: true,
      openToJoin: false,
      captainName: 'Rahul (Captain)',
      joinRequests: [],
      scoreCard: {
        team1: 'Strikers FC',
        team2: 'Blasters XI',
        score1: '4',
        score2: '2',
        result: 'Strikers FC won 4 - 2',
        isCompleted: true
      },
      requestedAt: '2026-06-06T15:00:00Z',
      matchPlayers: [
        { name: 'Rahul (Captain)', email: 'rahul.strikers@gmail.com', isShadow: false, team: 1 },
        { name: 'Amit Kumar', email: 'amit@gmail.com', isShadow: false, team: 1 },
        { name: 'Ramesh Offline', email: null, isShadow: true, team: 2 },
        { name: 'Sunil Shadow', email: null, isShadow: true, team: 2 }
      ]
    }
  ]

  // Bookings — persisted to localStorage
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('sr_bookings')
      return saved ? JSON.parse(saved) : defaultBookings
    } catch { return defaultBookings }
  })

  // Persist bookings, profiles, groups on every change
  useEffect(() => {
    localStorage.setItem('sr_bookings', JSON.stringify(bookings))
  }, [bookings])

  useEffect(() => {
    localStorage.setItem('sr_profiles', JSON.stringify(profiles))
  }, [profiles])

  useEffect(() => {
    localStorage.setItem('sr_groups', JSON.stringify(groups))
  }, [groups])

  // Booking inputs
  const [selectedHours, setSelectedHours] = useState([])
  const [isOpenToJoinToggle, setIsOpenToJoinToggle] = useState(false)
  const [selectedGroupName, setSelectedGroupName] = useState('Strikers FC')
  const [selectedBookedSlotId, setSelectedBookedSlotId] = useState(null)
  const [numPlayers, setNumPlayers] = useState(8)
  const [scoringMatchId, setScoringMatchId] = useState(null)

  // Shadow Player creation (Owner view)
  const [newShadowName, setNewShadowName] = useState('')
  const [newShadowEmail, setNewShadowEmail] = useState('') // Optional
  const [tagShadowCode, setTagShadowCode] = useState('')
  const [tagEmail, setTagEmail] = useState('')

  // Create Group Fields (Max 2 Check)
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupSport, setNewGroupSport] = useState('cricket')

  // Equipment Add-ons
  const [cricketAddons, setCricketAddons] = useState({ bats: false, balls: false, wickets: false })
  const [footballAddons, setFootballAddons] = useState({ nets: false })
  const [waterAddon, setWaterAddon] = useState(false)
  const [waterQty, setWaterQty] = useState(2)

  // Join match request checkbox & guest count state
  const [acceptJoinTerms, setAcceptJoinTerms] = useState(false)
  const [guestPlayersCount, setGuestPlayersCount] = useState(1)

  // Live Scorecard Editor states
  const [activeScorecardBookingId, setActiveScorecardBookingId] = useState(null)
  const [scorecardStep, setScorecardStep] = useState('splitter') // 'splitter', 'toss', 'setup', 'scoring'
  const [tossCoinState, setTossCoinState] = useState({ spinning: false, winner: null, choice: null, showModal: false })
  const [tossWinnerOverride, setTossWinnerOverride] = useState(1)
  const [tossChoiceOverride, setTossChoiceOverride] = useState('Batting')
  const [matchOversInput, setMatchOversInput] = useState(6)
  const [singleBattingInput, setSingleBattingInput] = useState(true)
  const [batsmanStriker, setBatsmanStriker] = useState('')
  const [batsmanNonStriker, setBatsmanNonStriker] = useState('')
  const [currentBowler, setCurrentBowler] = useState('')

  // Simulated Time & Alert states
  const [simulatedHour, setSimulatedHour] = useState(new Date().getHours())
  const [dismissedMatchPopups, setDismissedMatchPopups] = useState([])
  const [newMatchPlayerName, setNewMatchPlayerName] = useState('')
  const [activePlayingNames, setActivePlayingNames] = useState([])

  // Dashboard tab state for Admin
  const [adminDashTab, setAdminDashTab] = useState('profiles') // 'profiles' | 'bookings' | 'owners'

  // ── Toast notification system ──
  const [toasts, setToasts] = useState([])
  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
  }, [])

  // ── Custom modal dialog system (replaces browser alert/confirm/prompt) ──
  const [customModal, setCustomModal] = useState(null) // { type: 'alert'|'confirm'|'prompt', title, message, defaultValue, placeholder, resolve }
  const [modalInputValue, setModalInputValue] = useState('')

  const showAlert = useCallback((message, title = 'Notification') => {
    return new Promise(resolve => {
      setCustomModal({ type: 'alert', title, message, resolve })
    })
  }, [])

  const showConfirm = useCallback((message, title = 'Are you sure?') => {
    return new Promise(resolve => {
      setCustomModal({ type: 'confirm', title, message, resolve })
    })
  }, [])

  const showPrompt = useCallback((message, defaultValue = '', placeholder = '', title = 'Input Required') => {
    setModalInputValue(defaultValue)
    return new Promise(resolve => {
      setCustomModal({ type: 'prompt', title, message, defaultValue, placeholder, resolve })
    })
  }, [])

  const showSelectPrompt = useCallback((message, options, defaultValue = '', title = 'Selection Required') => {
    setModalInputValue(defaultValue || options[0])
    return new Promise(resolve => {
      setCustomModal({ type: 'select', title, message, options, defaultValue, resolve })
    })
  }, [])

  const handleModalSubmit = (e) => {
    if (e) e.preventDefault()
    if (customModal) {
      if (customModal.type === 'prompt' || customModal.type === 'select') {
        customModal.resolve(modalInputValue)
      } else {
        customModal.resolve(true)
      }
      setCustomModal(null)
    }
  }

  const handleModalCancel = () => {
    if (customModal) {
      if (customModal.type === 'confirm') {
        customModal.resolve(false)
      } else if (customModal.type === 'prompt' || customModal.type === 'select') {
        customModal.resolve(null)
      } else {
        customModal.resolve(true)
      }
      setCustomModal(null)
    }
  }

  // Fetch initial data from Supabase if configured
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const fetchInitialData = async () => {
      try {
        // 1. Fetch Profiles
        const { data: dbProfiles, error: pError } = await supabase
          .from('profiles')
          .select('*')
        if (!pError && dbProfiles) {
          const mapped = dbProfiles.map(p => ({
            id: p.id,
            name: p.full_name,
            email: p.email,
            role: p.role,
            runs: p.role === 'player' ? 0 : null,
            wickets: p.role === 'player' ? 0 : null,
            matches: p.role === 'player' ? 0 : null,
            isShadow: false
          }))
          setProfiles(prev => {
            const shadows = prev.filter(x => x.isShadow);
            const shadowIds = new Set(shadows.map(s => s.id));
            const uniqueMapped = mapped.filter(m => !shadowIds.has(m.id));
            return [...shadows, ...uniqueMapped];
          })
        }

        // 2. Fetch Bookings
        const { data: dbBookings, error: bError } = await supabase
          .from('bookings')
          .select('*')
        if (!bError && dbBookings) {
          const mappedBookings = await Promise.all(dbBookings.map(async (b) => {
            const { data: dbPlayers } = await supabase
              .from('match_players')
              .select('*, profiles(full_name, email)')
              .eq('booking_id', b.id)

            const { data: dbScores } = await supabase
              .from('match_scores')
              .select('*')
              .eq('booking_id', b.id)
              .maybeSingle()

            const matchPlayers = dbPlayers ? dbPlayers.map(p => ({
              name: p.profiles?.full_name || 'Guest Player',
              email: p.profiles?.email || null,
              isShadow: !p.profiles?.email,
              team: p.team_number
            })) : []

            const scoreCard = dbScores ? {
              team1: dbScores.team1_name,
              team2: dbScores.team2_name,
              score1: dbScores.team1_score?.toString() || '0/0',
              score2: dbScores.team2_score?.toString() || '0/0',
              result: dbScores.is_live ? 'Match in progress' : 'Completed',
              isCompleted: !dbScores.is_live
            } : null

            return {
              id: b.id,
              sportId: b.turf_id === 1 ? 'cricket' : b.turf_id === 2 ? 'football' : 'others',
              turfId: b.turf_id,
              dateIndex: 0,
              time: `${b.start_hour > 12 ? b.start_hour - 12 : b.start_hour}:00 ${b.start_hour >= 12 ? 'PM' : 'AM'}`,
              duration: b.duration,
              status: b.status === 'approved' ? 'booked_private' : b.status,
              teamName: 'Strikers FC',
              playerCount: matchPlayers.length,
              ownerApproved: b.status === 'approved',
              openToJoin: b.open_to_join,
              captainName: 'Rahul (Captain)',
              joinRequests: [],
              scoreCard: scoreCard,
              matchPlayers: matchPlayers,
              matchStarted: scoreCard !== null
            }
          }))

          setBookings(prev => {
            const existingIds = new Set(mappedBookings.map(x => x.id));
            const uniqueOld = prev.filter(x => !existingIds.has(x.id));
            return [...uniqueOld, ...mappedBookings];
          })
        }
      } catch (err) {
        console.error('Error fetching Supabase data:', err)
      }
    }

    fetchInitialData()
  }, [])


  // Generate Date list (Next 7 days) and find if Saturday or Sunday
  const dates = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const result = []
    for (let i = 0; i < 7; i++) {
      const d = new Date()
      d.setDate(d.getDate() + i)
      const dayName = days[d.getDay()]
      result.push({
        dayName: i === 0 ? 'Today' : dayName,
        dayOfWeekName: dayName,
        isWeekend: dayName === 'Sat' || dayName === 'Sun',
        num: d.getDate(),
        formatted: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      })
    }
    return result
  }, [])

  // 1-hour uniform slots from 06:00 AM to 11:00 PM
  const slotsData = useMemo(() => {
    const list = []
    for (let hour = 6; hour <= 23; hour++) {
      const displayHour = hour > 12 ? hour - 12 : hour
      const suffix = hour >= 12 ? 'PM' : 'AM'
      const timeStr = `${displayHour.toString().padStart(2, '0')}:00 ${suffix}`
      
      let period = 'Morning'
      if (hour >= 12 && hour < 17) period = 'Afternoon'
      else if (hour >= 17 && hour < 20) period = 'Evening'
      else if (hour >= 20) period = 'Night'

      list.push({ hourValue: hour, time: timeStr, period })
    }
    return list
  }, [])

  // Detect active booking for the currently logged-in player that matches simulated time and is approved by owner
  const activePlayableBooking = useMemo(() => {
    if (!isLoggedIn || !currentUser) return null
    return bookings.find(b => {
      if (b.dateIndex !== 0) return false
      // Turf booking must be approved by the owner
      if (!b.ownerApproved) return false
      if (b.status === 'completed' || b.matchStarted) return false
      if (dismissedMatchPopups.includes(b.id)) return false
      
      const startSlot = slotsData.find(s => s.time === b.time)
      if (!startSlot) return false
      
      const startHour = startSlot.hourValue
      const endHour = startHour + b.duration
      const isMatchTime = simulatedHour >= startHour && simulatedHour < endHour
      if (!isMatchTime) return false
      
      const isUserInBooking = b.captainName === currentUser.name || 
                              (b.matchPlayers && b.matchPlayers.some(p => p.name === currentUser.name))
      return isUserInBooking
    })
  }, [bookings, isLoggedIn, currentUser, simulatedHour, dismissedMatchPopups, slotsData])

  // Get all in-progress matches that the user has access to
  const inProgressMatches = useMemo(() => {
    return bookings.filter(b => {
      if (b.status === 'completed' || !b.matchStarted) return false
      if (currentUser?.role === 'owner' || currentUser?.role === 'admin') return true
      const isPart = b.captainName === currentUser?.name || 
                     (b.matchPlayers && b.matchPlayers.some(p => p.name === currentUser?.name || (currentUser?.email && p.email === currentUser?.email)))
      return isPart
    })
  }, [bookings, currentUser])

  // Create lookup map of booked/pending hours
  // Important Rule: Users cannot book if somebody has already booked a slot and is waiting for approval
  const currentBookedHours = useMemo(() => {
    const booked = new Set()
    bookings.forEach(b => {
      if (b.turfId === selectedTurf && b.dateIndex === selectedDateIndex) {
        // Blocks slot regardless of approval status (approved, pending_approval, live_match)
        if (b.status !== 'rejected' && b.status !== 'cancelled') {
          const startSlot = slotsData.find(s => s.time === b.time)
          if (startSlot) {
            for (let i = 0; i < b.duration; i++) {
              booked.add(startSlot.hourValue + i)
            }
          }
        }
      }
    })
    return booked
  }, [bookings, selectedTurf, selectedDateIndex, slotsData])

  // Get count of available slots for a specific turf for the selected day
  const getAvailableSlotsCount = useCallback((turfId) => {
    const booked = new Set()
    bookings.forEach(b => {
      if (b.turfId === turfId && b.dateIndex === selectedDateIndex) {
        if (b.status !== 'rejected' && b.status !== 'cancelled') {
          const startSlot = slotsData.find(s => s.time === b.time)
          if (startSlot) {
            for (let i = 0; i < b.duration; i++) {
              booked.add(startSlot.hourValue + i)
            }
          }
        }
      }
    })
    return slotsData.length - booked.size
  }, [bookings, selectedDateIndex, slotsData])

  // Direct slot toggle handler enforcing consecutive hours
  const handleSlotClick = (slot) => {
    if (currentBookedHours.has(slot.hourValue)) {
      const bookedBooking = bookings.find(b => {
        if (b.turfId === selectedTurf && b.dateIndex === selectedDateIndex) {
          if (b.status !== 'rejected' && b.status !== 'cancelled') {
            const bStart = slotsData.find(s => s.time === b.time)
            if (bStart) {
              return slot.hourValue >= bStart.hourValue && slot.hourValue < bStart.hourValue + b.duration
            }
          }
        }
        return false
      })

      if (bookedBooking) {
        const isMyBooking = isLoggedIn && currentUser &&
          (bookedBooking.captainName === currentUser.name ||
           bookedBooking.booker_id === currentUser.id ||
           (bookedBooking.matchPlayers && bookedBooking.matchPlayers.some(p =>
             p.name === currentUser.name || (p.email && currentUser.email && p.email === currentUser.email)
           )))

        if (bookedBooking.openToJoin || isMyBooking) {
          setSelectedBookedSlotId(bookedBooking.id)
          setSelectedHours([]) // Clear other hours selection
          return
        }
      }

      showToast('This slot is already booked or is awaiting owner approval!', 'error')
      return // Booked or pending slot
    }

    setSelectedBookedSlotId(null)

    if (selectedHours.includes(slot.hourValue)) {
      if (selectedHours.length === 1) {
        setSelectedHours([])
      } else {
        const min = Math.min(...selectedHours)
        const max = Math.max(...selectedHours)
        
        if (slot.hourValue === min) {
          setSelectedHours(prev => prev.filter(h => h !== min))
        } else if (slot.hourValue === max) {
          setSelectedHours(prev => prev.filter(h => h !== max))
        } else {
          // Deselect everything from clicked hour and onwards
          setSelectedHours(prev => prev.filter(h => h < slot.hourValue))
        }
      }
    } else {
      if (selectedHours.length === 0) {
        setSelectedHours([slot.hourValue])
      } else {
        const min = Math.min(...selectedHours)
        const max = Math.max(...selectedHours)

        const newMin = Math.min(min, slot.hourValue)
        const newMax = Math.max(max, slot.hourValue)
        
        const candidateHours = []
        let hasBookedHour = false
        for (let h = newMin; h <= newMax; h++) {
          candidateHours.push(h)
          if (currentBookedHours.has(h)) {
            hasBookedHour = true
          }
        }

        if (hasBookedHour) {
          setSelectedHours([slot.hourValue])
        } else {
          setSelectedHours(candidateHours.sort((a,b) => a-b))
        }
      }
    }
  }

  // Calculate pricing based on current selection using Owner floodlight Start Hour
  const pricingData = useMemo(() => {
    const activeDate = dates[selectedDateIndex]
    let total = 0
    const items = []

    selectedHours.forEach(hour => {
      // Dynamic boundary set by Owner
      const isPeakHour = hour >= floodlightStartHour
      let price = 0

      if (activeDate.isWeekend) {
        price = isPeakHour ? 800 : 700
      } else {
        price = isPeakHour ? 700 : 600
      }

      const displayHour = hour > 12 ? hour - 12 : hour
      const suffix = hour >= 12 ? 'PM' : 'AM'
      const slotLabel = `${displayHour.toString().padStart(2, '0')}:00 ${suffix}`

      total += price
      items.push({ slotLabel, price })
    })

    // Add-ons
    let addonCost = 0
    if (selectedSport === 'cricket') {
      if (cricketAddons.bats) addonCost += 100
      if (cricketAddons.balls) addonCost += 50
      if (cricketAddons.wickets) addonCost += 50
    } else if (selectedSport === 'football') {
      if (footballAddons.nets) addonCost += 150
    }
    if (waterAddon) {
      addonCost += waterQty * 20
    }

    return { total: total + addonCost, baseTotal: total, addonCost, items }
  }, [selectedHours, selectedDateIndex, dates, selectedSport, cricketAddons, footballAddons, waterAddon, waterQty, floodlightStartHour])

  const activeSlotDetail = useMemo(() => {
    if (selectedHours.length === 0) return null
    return { status: 'available' }
  }, [selectedHours])

  const handleSportSelect = (sportId) => {
    setSelectedSport(sportId)
    setViewingDashboard(false)
    setSelectedHours([])
    setSelectedBookedSlotId(null)
  }

  const handleCreateBooking = () => {
    if (!isLoggedIn) {
      showToast('You must sign in to reserve a turf!', 'error')
      setShowLoginModal(true)
      return
    }

    if (selectedHours.length === 0) return

    const startHour = Math.min(...selectedHours)
    const startSlot = slotsData.find(s => s.hourValue === startHour)

    // Setup initial match roster from selected Group members
    let initialMatchPlayers = []
    if (selectedGroupName !== 'Individual Play') {
      const selectedGroupObj = groups.find(g => g.name === selectedGroupName)
      if (selectedGroupObj) {
        initialMatchPlayers = selectedGroupObj.members.map(m => ({
          name: m.name,
          email: m.email || null,
          isShadow: m.isShadow || false,
          team: null
        }))
      }
    } else {
      initialMatchPlayers = [
        { name: currentUser.name, email: currentUser.email || null, isShadow: false, team: null }
      ]
    }

    const newBooking = {
      id: Date.now().toString(),
      sportId: selectedSport,
      turfId: selectedTurf,
      dateIndex: selectedDateIndex,
      time: startSlot.time,
      duration: selectedHours.length,
      status: currentUser?.role === 'owner' ? 'booked_private' : 'pending_approval',
      teamName: selectedGroupName,
      playerCount: initialMatchPlayers.length,
      ownerApproved: currentUser?.role === 'owner',
      openToJoin: isOpenToJoinToggle,
      captainName: currentUser.name,
      joinRequests: [],
      scoreCard: selectedSport === 'cricket' ? {
        team1: selectedGroupName,
        team2: 'Opponent Team',
        score1: '0/0',
        overs1: '0',
        score2: '0/0',
        overs2: '0',
        result: 'Match is scheduled',
        isCompleted: false,
        battingTeam: 1, // 1 or 2
        striker: '',
        nonStriker: '',
        bowler: '',
        strikerRuns: 0,
        strikerBalls: 0,
        nonStrikerRuns: 0,
        nonStrikerBalls: 0,
        bowlerBalls: 0,
        bowlerRuns: 0,
        bowlerWickets: 0,
        ballsThisOver: []
      } : {
        team1: selectedGroupName,
        team2: 'Opponent Team',
        score1: 0,
        score2: 0,
        result: 'Match is scheduled',
        isCompleted: false
      },
      matchPlayers: initialMatchPlayers,
      requestedAt: new Date().toISOString()
    }

    if (isSupabaseConfigured) {
      const syncBooking = async () => {
        try {
          const dateString = new Date().toISOString().split('T')[0]
          const { data, error } = await supabase
            .from('bookings')
            .insert({
              turf_id: selectedTurf,
              booker_id: currentUser.id,
              booking_date: dateString,
              start_hour: startHour,
              duration: selectedHours.length,
              total_price: pricingData.total,
              player_count: initialMatchPlayers.length,
              open_to_join: isOpenToJoinToggle,
              status: currentUser?.role === 'owner' ? 'approved' : 'pending_approval'
            })
            .select()
            .single()

          if (error) {
            console.error('Failed to save booking to Supabase:', error)
          } else if (data) {
            newBooking.id = data.id
            const rosterToInsert = []
            if (currentUser && currentUser.id) {
              rosterToInsert.push({
                booking_id: data.id,
                profile_id: currentUser.id
              })
            }
            if (rosterToInsert.length > 0) {
              await supabase.from('match_players').insert(rosterToInsert)
            }
          }
        } catch (e) {
          console.error(e)
        }
      }
      syncBooking()
    }

    setBookings(prev => [...prev, newBooking])
    setSelectedHours([])
    showToast(currentUser?.role === 'owner' ? 'Booking confirmed immediately!' : 'Booking requested! Owner approval pending.', currentUser?.role === 'owner' ? 'success' : 'info')
  }

  // Create Account with existing shadow profile tag strategy
  const handleRegister = (e) => {
    e.preventDefault()
    if (!regName || !regEmail) {
      showToast('Please fill out all fields!', 'error')
      return
    }

    let newUser = {}

    if (isExistingPlayerToggle && selectedShadowProfile) {
      // Import existing shadow profile and assign gmail
      const shadowIndex = profiles.findIndex(p => p.id === selectedShadowProfile.id)
      const updatedProfiles = [...profiles]
      
      updatedProfiles[shadowIndex] = {
        ...selectedShadowProfile,
        email: regEmail,
        isShadow: false
      }

      setProfiles(updatedProfiles)
      newUser = updatedProfiles[shadowIndex]

      // Link in groups members as well
      setGroups(prev => prev.map(g => {
        return {
          ...g,
          members: g.members.map(m => {
            if (m.claimCode === selectedShadowProfile.claimCode) {
              return { ...m, email: regEmail, isShadow: false, claimCode: null }
            }
            return m
          })
        }
      }))

      showAlert(`Claimed player profile! "${selectedShadowProfile.name}" is now linked to ${regEmail} with all past stats imported!`, 'Profile Claimed')
    } else {
      // Normal registration: use timestamp-based stable local ID
      newUser = {
        id: 'local_' + Date.now(),
        name: regName,
        email: regEmail,
        role: regRole,
        runs: regRole === 'player' ? 0 : null,
        wickets: regRole === 'player' ? 0 : null,
        matches: regRole === 'player' ? 0 : null
      }
      setProfiles(prev => [...prev, newUser])
      showToast(`Account created successfully as ${regRole.toUpperCase()}!`, 'success')
    }

    setCurrentUser(newUser)
    setIsLoggedIn(true)
    setShowLoginModal(false)

    // Reset fields
    setRegName('')
    setRegEmail('')
    setRegRole('player')
    setIsExistingPlayerToggle(false)
    setSelectedShadowProfile(null)
    setPlayerSearchQuery('')
  }

  // Owner/Admin Creates Profiles
  const handleOwnerAdminCreateProfile = (e) => {
    e.preventDefault()
    if (!newShadowName) return

    const isShadow = !newShadowEmail
    const claimCode = isShadow ? 'SR-' + Math.random().toString(36).substring(2, 7).toUpperCase() : null

    // Determine role: Admins can create players or owners. Owners can only create players.
    const roleToCreate = currentUser.role === 'admin' ? regRole : 'player'

    const newProfile = {
      id: 'p_' + Date.now(),
      name: newShadowName,
      email: newShadowEmail || null,
      role: roleToCreate,
      runs: roleToCreate === 'player' ? 0 : null,
      wickets: roleToCreate === 'player' ? 0 : null,
      matches: roleToCreate === 'player' ? 0 : null,
      isShadow: isShadow,
      claimCode: claimCode
    }

    setProfiles(prev => [...prev, newProfile])
    setNewShadowName('')
    setNewShadowEmail('')
    
    if (isShadow) {
      showAlert(`Shadow Player Profile Created!\nName: ${newShadowName}\nClaim Code: ${claimCode}\nThis player can now register later and claim their stats!`, 'Shadow Profile Created')
    } else {
      showAlert(`Profile Created!\nName: ${newShadowName}\nEmail: ${newShadowEmail}\nRole: ${roleToCreate.toUpperCase()}`, 'Profile Created')
    }
  }

  const handleCreateGroup = (e) => {
    e.preventDefault()
    if (!newGroupName) return

    const userCreatedCount = groups.filter(g => g.creator === currentUser.name).length
    if (currentUser.role === 'player' && userCreatedCount >= 2) {
      showToast('Error: You can only create a maximum of 2 groups!', 'error')
      return
    }

    const newGroupObj = {
      id: 'g' + (groups.length + 1),
      name: newGroupName,
      sport: newGroupSport,
      creator: currentUser.name,
      createdWhen: new Date().toISOString().split('T')[0],
      members: [
        { name: currentUser.name, email: currentUser.email, isShadow: false }
      ]
    }

    setGroups(prev => [...prev, newGroupObj])
    setNewGroupName('')
    showToast(`Group "${newGroupName}" created successfully!`, 'success')
  }

  const handleAddGroupMember = (groupId, playerProfileId) => {
    const profile = profiles.find(p => p.id === playerProfileId)
    if (!profile) return

    const group = groups.find(g => g.id === groupId)
    if (!group) return

    const exists = group.members.some(m => m.name === profile.name || (profile.email && m.email === profile.email))
    if (exists) {
      showToast('Player is already in this group!', 'error')
      return
    }

    showToast(`Added "${profile.name}" to group!`, 'success')
    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          members: [...g.members, { 
            name: profile.name, 
            email: profile.email || null, 
            isShadow: profile.isShadow, 
            claimCode: profile.claimCode || null 
          }]
        }
      }
      return g
    }))
  }

  const handleRemoveGroupMember = (groupId, memberName) => {
    const group = groups.find(g => g.id === groupId)
    if (!group) return

    if (memberName === group.creator || (group.creator.includes('Rahul') && memberName.includes('Rahul'))) {
      showToast('Cannot remove the Group Creator!', 'error')
      return
    }

    showToast(`Removed member "${memberName}" from group.`, 'info')
    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          members: g.members.filter(m => m.name !== memberName)
        }
      }
      return g
    }))
  }

  const handleJoinMatchRequest = (bookingId, count) => {
    if (!isLoggedIn) {
      showToast('You must log in to request to join a match!', 'error')
      setShowLoginModal(true)
      return
    }

    const booking = bookings.find(b => b.id === bookingId)
    if (!booking) return

    const alreadyRequested = booking.joinRequests?.some(r => r.playerName === currentUser.name)
    if (alreadyRequested) {
      showToast('You have already requested to join this match!', 'error')
      return
    }

    showToast(`Join request sent to captain for ${count} player(s)!`, 'success')
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          joinRequests: [...(b.joinRequests || []), { 
            id: 'jr_' + Date.now(), 
            playerName: currentUser.name, 
            email: currentUser.email || 'guest@play.com',
            count: count
          }]
        }
      }
      return b
    }))
  }

  const handleApproveJoinRequest = (bookingId, requestId) => {
    const booking = bookings.find(b => b.id === bookingId)
    if (!booking) return
    const req = booking.joinRequests?.find(r => r.id === requestId)
    if (!req) return

    const count = req.count || 1
    showToast(`Approved ${req.playerName}'s request to join with ${count} player(s)!`, 'success')

    const newPlayers = []
    for (let i = 0; i < count; i++) {
      newPlayers.push({
        name: i === 0 ? req.playerName : `${req.playerName} (Guest ${i})`,
        email: i === 0 ? req.email : null,
        isShadow: i > 0,
        team: null
      })
    }

    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          playerCount: b.playerCount + count,
          matchPlayers: [...(b.matchPlayers || []), ...newPlayers],
          joinRequests: b.joinRequests.filter(r => r.id !== requestId)
        }
      }
      return b
    }))
  }

  const handleRejectJoinRequest = (bookingId, requestId) => {
    showToast('Join request rejected.', 'info')
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          joinRequests: b.joinRequests.filter(r => r.id !== requestId)
        }
      }
      return b
    }))
  }

  const handleAssignMatchPlayerTeam = (bookingId, playerName, teamVal) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          matchPlayers: b.matchPlayers.map(p => {
            if (p.name === playerName) {
              return { ...p, team: teamVal }
            }
            return p
          })
        }
      }
      return b
    }))
  }

  const handleRemoveMatchPlayer = (bookingId, playerName) => {
    showToast(`Removed ${playerName} from match roster.`, 'info')
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          playerCount: Math.max(0, b.playerCount - 1),
          matchPlayers: b.matchPlayers.filter(p => p.name !== playerName)
        }
      }
      return b
    }))
  }

  const handleAddMatchPlayer = (bookingId, playerProfileId) => {
    const profile = profiles.find(p => p.id === playerProfileId)
    if (!profile) return

    const booking = bookings.find(b => b.id === bookingId)
    if (!booking) return

    const exists = booking.matchPlayers?.some(p => p.name === profile.name)
    if (exists) {
      showToast('Player is already in the match roster!', 'error')
      return
    }

    showToast(`Added ${profile.name} to match roster.`, 'success')
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          playerCount: b.playerCount + 1,
          matchPlayers: [...(b.matchPlayers || []), {
            name: profile.name,
            email: profile.email || null,
            isShadow: profile.isShadow,
            team: null
          }]
        }
      }
      return b
    }))
  }

  const handleUpdateScorecard = (bookingId, updatedScorecard) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          scoreCard: {
            ...b.scoreCard,
            ...updatedScorecard
          }
        }
      }
      return b
    }))
  }

  const handleOwnerApproveBooking = (bookingId) => {
    showToast('Booking Approved Successfully!', 'success')
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, ownerApproved: true, status: 'booked_private' }
      }
      return b
    }))
  }

  const handleOwnerRejectBooking = (bookingId) => {
    showToast('Booking Rejected and slot freed.', 'info')
    setBookings(prev => prev.filter(b => b.id !== bookingId))
    setSelectedHours([])
  }

  // Claim/Link Shadow Profile click
  const handleSelectShadowProfile = (profile) => {
    setSelectedShadowProfile(profile)
    setRegName(profile.name)
    setPlayerSearchQuery(profile.name)
  }

  const handleDemoLogin = async (profile) => {
    let mockProfile = {}
    if (profile === 'captain') {
      mockProfile = { name: 'Rahul (Captain)', email: 'rahul.strikers@gmail.com', role: 'player', runs: 342, wickets: 12, matches: 14 }
    } else if (profile === 'guest') {
      mockProfile = { name: 'Vikram', email: 'vikram.play@yahoo.com', role: 'player', runs: 85, wickets: 3, matches: 5 }
    } else if (profile === 'owner') {
      mockProfile = { name: 'Amit (Owner)', email: 'amit.owner@smashnroast.com', role: 'owner', runs: 0, wickets: 0, matches: 0 }
    } else if (profile === 'admin') {
      mockProfile = { name: 'Super Admin', email: 'puneethgp18@gmail.com', role: 'admin', runs: 0, wickets: 0, matches: 0 }
    }

    // Start with a stable local ID (so bookings & profiles stay linked on refresh)
    let userProfile = { ...mockProfile, id: 'local_' + profile }

    if (isSupabaseConfigured) {
      try {
        // Try signing in first
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: mockProfile.email,
          password: 'password123'
        })

        if (!signInError && signInData?.user) {
          // Sign-in succeeded — use the real Supabase UUID
          userProfile.id = signInData.user.id
          console.log('✅ Signed in to Supabase as', mockProfile.email)
        } else {
          // Sign-in failed — try sign-up (first time setup)
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: mockProfile.email,
            password: 'password123',
            options: {
              data: {
                full_name: mockProfile.name,
                role: mockProfile.role
              }
            }
          })

          if (!signUpError && signUpData?.user) {
            userProfile.id = signUpData.user.id
            console.log('✅ Signed up to Supabase as', mockProfile.email)
          } else {
            // Supabase completely unavailable — log and continue locally
            console.warn('⚠️ Supabase auth unavailable, running in local mode:', signUpError?.message || signInError?.message)
          }
        }
      } catch (err) {
        console.warn('⚠️ Supabase connection failed, running in local mode:', err)
      }
    }

    setCurrentUser(userProfile)
    setIsLoggedIn(true)
    setShowLoginModal(false)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentUser(null)
    setViewingDashboard(false)
    setSelectedHours([])
    setSelectedBookedSlotId(null)
  }

  const handleOpenScorecard = (booking) => {
    setActiveScorecardBookingId(booking.id)
    setActivePlayingNames(booking.matchPlayers ? booking.matchPlayers.map(p => p.name) : [])
    
    const tAPlayers = booking.matchPlayers?.filter(p => p.team === 1) || []
    const tBPlayers = booking.matchPlayers?.filter(p => p.team === 2) || []
    const defaultOvers = Math.max(tAPlayers.length, tBPlayers.length) || 6
    
    setTossWinnerOverride(1)
    setTossChoiceOverride('Batting')
    setMatchOversInput(booking.scoreCard?.matchOvers || defaultOvers)
    setSingleBattingInput(booking.scoreCard?.singleBattingAllowed !== false)

    if (booking.sportId === 'football') {
      if (!booking.scoreCard || booking.scoreCard.result === 'Match is scheduled') {
        setScorecardStep('new_splitter')
      } else {
        setScorecardStep('scoring')
      }
    } else {
      setScorecardStep(
        !booking.scoreCard || booking.scoreCard.result === 'Match is scheduled'
          ? 'new_splitter'
          : !booking.scoreCard.tossWinner
          ? 'toss'
          : !booking.scoreCard.striker
          ? 'setup'
          : 'scoring'
      )
    }
  }

  return (
    <>
      {/* Navigation Header */}
      <nav className="navbar">
        <a href="/" className="logo-container" onClick={(e) => { e.preventDefault(); setSelectedSport(null); setViewingDashboard(false); setScoringMatchId(null); }}>
          <span className="logo-icon">SR</span>
          <span className="logo-text">SMASH <span>&</span> ROAST</span>
          
          {/* Database Connection Status Badge */}
          <span className="db-status-badge" style={{
            fontSize: '9px',
            padding: '3px 8px',
            borderRadius: '20px',
            marginLeft: '8px',
            fontWeight: 'bold',
            background: isSupabaseConfigured ? 'rgba(0, 255, 115, 0.1)' : 'rgba(255, 165, 0, 0.1)',
            color: isSupabaseConfigured ? 'var(--accent-football)' : 'orange',
            border: `1px solid ${isSupabaseConfigured ? 'rgba(0, 255, 115, 0.2)' : 'rgba(255, 165, 0, 0.2)'}`
          }}>
            <span className="status-dot">●</span>{' '}
            <span className="status-text">{isSupabaseConfigured ? 'DB CONNECTED' : 'LOCAL SANDBOX'}</span>
          </span>
        </a>
        
        <div className="nav-actions">
          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span 
                className="nav-link" 
                style={{ color: viewingDashboard ? 'var(--accent-football)' : 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 'bold' }}
                onClick={() => { setViewingDashboard(true); setSelectedSport(null); }}
              >
                <User size={16} /> My Dashboard
              </span>
              <button className="btn-login" style={{ display: 'flex', alignItems: 'center', gap: '6px', borderColor: 'var(--accent-cricket)', color: 'var(--accent-cricket)' }} onClick={handleLogout}>
                <LogOut size={14} /> Log Out
              </button>
            </div>
          ) : (
            <button className="btn-login" onClick={() => { setShowLoginModal(true); setAuthTab('login'); }}>Sign In / Register</button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderLeft: '1px solid var(--border-glow)', paddingLeft: '12px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'bold' }}>TIME:</span>
            <input 
              type="range" 
              min="6" 
              max="23" 
              value={simulatedHour} 
              onChange={(e) => setSimulatedHour(parseInt(e.target.value))}
              style={{ width: '80px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '11px', fontWeight: 'bold', minWidth: '55px', color: 'var(--accent-football)' }}>
              {simulatedHour > 12 ? `${simulatedHour - 12}:00 PM` : simulatedHour === 12 ? '12:00 PM' : `${simulatedHour}:00 AM`}
            </span>
          </div>
        </div>
      </nav>

      {/* Main View Area */}
      <main style={{ width: '100%' }}>
        
        {/* Floating Active Match Alert Popup */}
        {activePlayableBooking && (
          <div className="active-match-popup">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  display: 'inline-block',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: 'var(--accent-football)',
                  animation: 'pulse 1.5s infinite'
                }}></span>
                <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
                  Active Match Booking Now!
                </h4>
              </div>
              <button 
                onClick={() => setDismissedMatchPopups(prev => [...prev, activePlayableBooking.id])}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '16px',
                  lineHeight: '1'
                }}
              >
                ✕
              </button>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '8px 0 16px', textAlign: 'left' }}>
              Your booking for <strong>{activePlayableBooking.sportId.toUpperCase()}</strong> ({activePlayableBooking.teamName}) at <strong>{activePlayableBooking.time}</strong> is scheduled for right now.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn-book-action"
                style={{ padding: '8px 16px', fontSize: '13px', width: 'auto' }}
                onClick={() => handleOpenScorecard(activePlayableBooking)}
              >
                ⚡ Start Playing
              </button>
              <button 
                className="btn-login"
                style={{ padding: '8px 16px', fontSize: '13px', margin: '0' }}
                onClick={() => setDismissedMatchPopups(prev => [...prev, activePlayableBooking.id])}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* LOGIN & CREATE ACCOUNT MODAL */}
        {showLoginModal && (
          <div className="login-overlay">
            <div className="login-card">
              
              {/* Tab toggles */}
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border-glow)', marginBottom: '24px' }}>
                <button 
                  className={`nav-link ${authTab === 'login' ? 'active' : ''}`}
                  style={{ flex: '1', paddingBottom: '12px', borderBottom: authTab === 'login' ? '2px solid var(--accent-football)' : '', fontWeight: 'bold' }}
                  onClick={() => setAuthTab('login')}
                >
                  Sign In
                </button>
                <button 
                  className={`nav-link ${authTab === 'register' ? 'active' : ''}`}
                  style={{ flex: '1', paddingBottom: '12px', borderBottom: authTab === 'register' ? '2px solid var(--accent-football)' : '', fontWeight: 'bold' }}
                  onClick={() => setAuthTab('register')}
                >
                  Create Account
                </button>
              </div>

              {authTab === 'login' ? (
                <div>
                  <input type="email" placeholder="Email Address" className="login-input" defaultValue="rahul.strikers@gmail.com" />
                  <input type="password" placeholder="Password" className="login-input" defaultValue="password123" />
                  
                  <button className="btn-book-action" style={{ width: '100%', marginBottom: '16px' }} onClick={() => handleDemoLogin('captain')}>
                    Sign In
                  </button>

                  <div style={{ borderTop: '1px solid var(--border-glow)', paddingTop: '16px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'bold' }}>QUICK LOGINS FOR TESTING:</span>
                    <div className="quick-login-grid" style={{ marginTop: '12px' }}>
                      <button className="role-selector" onClick={() => handleDemoLogin('captain')}>Player (Rahul)</button>
                      <button className="role-selector" onClick={() => handleDemoLogin('guest')}>Guest (Vikram)</button>
                      <button className="role-selector" onClick={() => handleDemoLogin('owner')}>Owner (Amit)</button>
                      <button className="role-selector" onClick={() => handleDemoLogin('admin')}>puneethgp18@gmail.com (Admin)</button>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRegister}>
                  {/* Claim Profile Toggle */}
                  <div className="booking-toggle" style={{ marginBottom: '20px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ textAlign: 'left' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600' }}>Are you already a player?</span>
                      <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Claim stats from an offline profile</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={isExistingPlayerToggle} 
                        onChange={(e) => {
                          setIsExistingPlayerToggle(e.target.checked)
                          setSelectedShadowProfile(null)
                          setRegName('')
                          setPlayerSearchQuery('')
                        }} 
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  {isExistingPlayerToggle ? (
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', textAlign: 'left', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 'bold' }}>
                        Search Profile Name:
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input 
                          type="text" 
                          placeholder="Search player name..." 
                          className="login-input" 
                          value={playerSearchQuery} 
                          onChange={(e) => setPlayerSearchQuery(e.target.value)} 
                        />
                        <Search size={16} style={{ position: 'absolute', right: '14px', top: '14px', color: 'var(--text-muted)' }} />
                      </div>
                      
                      {/* Search Results list */}
                      {filteredShadowProfiles.length > 0 && (
                        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glow)', borderRadius: '8px', maxHeight: '150px', overflowY: 'auto', textAlign: 'left' }}>
                          {filteredShadowProfiles.map(p => (
                            <div 
                              key={p.id} 
                              style={{ 
                                padding: '10px 14px', 
                                borderBottom: '1px solid var(--border-glow)', 
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'space-between',
                                background: selectedShadowProfile?.id === p.id ? 'rgba(0, 255, 102, 0.05)' : ''
                              }}
                              onClick={() => handleSelectShadowProfile(p)}
                            >
                              <span>{p.name} ({p.matches} matches, {p.runs} runs)</span>
                              {selectedShadowProfile?.id === p.id && <Check size={16} style={{ color: 'var(--accent-football)' }} />}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      className="login-input" 
                      required 
                      value={regName} 
                      onChange={(e) => setRegName(e.target.value)} 
                    />
                  )}

                  <input 
                    type="email" 
                    placeholder="Email Address / Gmail" 
                    className="login-input" 
                    required 
                    value={regEmail} 
                    onChange={(e) => setRegEmail(e.target.value)} 
                  />
                  
                  {/* Register Role defaults to player only (Admins create owners) */}
                  <div style={{ display: 'none' }}>
                    <select value={regRole} onChange={(e) => setRegRole(e.target.value)}>
                      <option value="player">Player</option>
                    </select>
                  </div>

                  <button type="submit" className="btn-book-action" style={{ width: '100%', marginTop: '10px' }}>
                    {isExistingPlayerToggle ? 'Claim Stats & Register' : 'Register Account'}
                  </button>
                </form>
              )}

              <button 
                className="btn-login" 
                style={{ width: '100%', marginTop: '16px', borderColor: 'transparent' }}
                onClick={() => setShowLoginModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ============================================================
            DASHBOARD — ROLE-BASED VIEWS
            ============================================================ */}
        {viewingDashboard ? (
          <div style={{ minHeight: '100vh', padding: '24px 0' }}>

            {/* ── NOT LOGGED IN: Guest CTA ────────────────────────────── */}
            {!isLoggedIn && (
              <div style={{ maxWidth: '720px', margin: '60px auto', padding: '0 24px', textAlign: 'center' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏟️</div>
                <h1 style={{ fontSize: '36px', fontWeight: '900', fontFamily: 'var(--font-heading)', marginBottom: '12px' }}>
                  Track Your Game
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '16px', marginBottom: '36px', lineHeight: '1.6' }}>
                  Sign in or create a profile to track your match history, upcoming bookings, team stats, and live scorecards.
                </p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    className="btn-book-action"
                    style={{ padding: '14px 36px', fontSize: '15px', fontWeight: '800' }}
                    onClick={() => { setShowLoginModal(true); setAuthTab('login') }}
                  >
                    Sign In
                  </button>
                  <button
                    className="btn-login"
                    style={{ padding: '14px 36px', fontSize: '15px', fontWeight: '800' }}
                    onClick={() => { setShowLoginModal(true); setAuthTab('register') }}
                  >
                    Create Profile
                  </button>
                </div>

                {/* Preview upcoming open bookings */}
                <div style={{ marginTop: '60px', textAlign: 'left' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                    Open Matches You Can Join
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {bookings.filter(b => b.openToJoin && b.status !== 'completed').slice(0, 3).map(b => (
                      <div key={b.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glow)', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{b.teamName}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                            {b.sportId === 'cricket' ? '🏏' : '⚽'} Turf {b.turfId} · {b.time} · {b.playerCount} players
                          </div>
                        </div>
                        <span style={{ fontSize: '10px', padding: '4px 10px', borderRadius: '20px', background: 'rgba(0,255,115,0.1)', color: 'var(--accent-football)', fontWeight: 'bold', border: '1px solid rgba(0,255,115,0.2)' }}>
                          OPEN
                        </span>
                      </div>
                    ))}
                    {bookings.filter(b => b.openToJoin && b.status !== 'completed').length === 0 && (
                      <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', padding: '12px', textAlign: 'center' }}>No open matches right now</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── LOGGED IN: Role-based dashboards ─────────────────────── */}
            {isLoggedIn && currentUser && (() => {
              const role = currentUser.role

              // Helper: user's bookings (as captain or team member)
              const myBookings = bookings.filter(b =>
                b.captainName === currentUser.name ||
                (b.matchPlayers && b.matchPlayers.some(p => p.name === currentUser.name || (currentUser.email && p.email === currentUser.email)))
              )
              const upcomingBookings = myBookings.filter(b => b.status !== 'completed' && b.dateIndex >= 0)
              const pastBookings = myBookings.filter(b => b.status === 'completed' || b.dateIndex < 0)

              // ── SUPER ADMIN ─────────────────────────────────────────────
              if (role === 'admin') return (
                <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '28px' }}>🛡️</span>
                        <h1 style={{ fontSize: '28px', fontWeight: '900', fontFamily: 'var(--font-heading)' }}>Super Admin Console</h1>
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Manage profiles, bookings, and venue owners</p>
                    </div>
                    <button className="btn-login" onClick={() => { setViewingDashboard(false); setSelectedSport('cricket') }}>
                      Book Turf
                    </button>
                  </div>

                  {/* Tab bar */}
                  <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid var(--border-glow)', marginBottom: '28px' }}>
                    {[['profiles', '👤 Profiles'], ['bookings', '📋 Bookings'], ['owners', '🏟️ Owners']].map(([tab, label]) => (
                      <button
                        key={tab}
                        onClick={() => setAdminDashTab(tab)}
                        style={{
                          background: 'transparent', border: 'none', cursor: 'pointer',
                          padding: '12px 28px', fontSize: '14px', fontWeight: 'bold',
                          color: adminDashTab === tab ? 'var(--accent-others)' : 'var(--text-muted)',
                          borderBottom: adminDashTab === tab ? '2px solid var(--accent-others)' : '2px solid transparent',
                          marginBottom: '-1px', transition: 'all 0.2s', fontFamily: 'var(--font-body)'
                        }}
                      >{label}</button>
                    ))}
                  </div>

                  {/* PROFILES TAB */}
                  {adminDashTab === 'profiles' && (
                    <div>
                      {/* Create profile form */}
                      <div style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '14px' }}>➕ Create User Profile</h3>
                        <form onSubmit={handleOwnerAdminCreateProfile} className="admin-create-profile-form">
                          <input type="text" placeholder="Display Name" className="login-input" style={{ margin: 0 }} required value={newShadowName} onChange={e => setNewShadowName(e.target.value)} />
                          <input type="email" placeholder="Email Address" className="login-input" style={{ margin: 0 }} required value={newShadowEmail} onChange={e => setNewShadowEmail(e.target.value)} />
                          <select className="role-selector" value={regRole} onChange={e => setRegRole(e.target.value)} style={{ height: '44px' }}>
                            <option value="player">Player</option>
                            <option value="owner">Owner</option>
                          </select>
                          <button type="submit" className="btn-cart-book" style={{ padding: '10px 20px', height: '44px', whiteSpace: 'nowrap' }}>Create</button>
                        </form>
                      </div>

                      {/* Profile table */}
                      <div className="admin-table-container" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glow)', borderRadius: '16px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                          <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-glow)' }}>
                              {['Name', 'Email / Status', 'Role', 'Permissions'].map(h => (
                                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {profiles.map(p => {
                              const isCurrent = p.email === currentUser.email
                              const roleColor = { admin: 'var(--accent-others)', owner: 'var(--accent-cricket)', player: 'var(--accent-football)' }[p.role] || 'var(--text-muted)'
                              const permissions = p.role === 'admin' ? 'Full access · Manage owners & profiles'
                                : p.role === 'owner' ? 'Approve bookings · Manage timings · Add players'
                                : 'Book slots · Join matches · Create groups (max 2)'
                              return (
                                <tr key={p.id} style={{ borderBottom: '1px solid var(--border-glow)', background: isCurrent ? 'rgba(139,92,246,0.04)' : 'transparent', transition: 'background 0.2s' }}>
                                  <td style={{ padding: '14px 16px', fontWeight: 'bold' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `${roleColor}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '14px', color: roleColor, border: `1px solid ${roleColor}44` }}>
                                        {p.name.charAt(0)}
                                      </div>
                                      <span>{p.name} {isCurrent && <span style={{ fontSize: '9px', color: 'var(--accent-football)', background: 'rgba(0,255,115,0.1)', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px' }}>YOU</span>}</span>
                                    </div>
                                  </td>
                                  <td style={{ padding: '14px 16px', color: p.isShadow ? 'var(--accent-cricket)' : 'var(--text-muted)' }}>
                                    {p.isShadow ? `Offline · Code: ${p.claimCode}` : p.email}
                                  </td>
                                  <td style={{ padding: '14px 16px' }}>
                                    <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', background: `${roleColor}22`, color: roleColor, border: `1px solid ${roleColor}44` }}>{p.role}</span>
                                  </td>
                                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '12px' }}>{permissions}</td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* BOOKINGS TAB */}
                  {adminDashTab === 'bookings' && (
                    <div>
                      <div className="admin-stats-grid" style={{ marginBottom: '20px' }}>
                        {[
                          { label: 'All Bookings', count: bookings.length, color: 'var(--text-muted)' },
                          { label: 'Pending', count: bookings.filter(b => b.status === 'pending_approval').length, color: 'orange' },
                          { label: 'Approved', count: bookings.filter(b => b.status === 'booked_private' || b.status === 'booked_open').length, color: 'var(--accent-football)' },
                        ].map(stat => (
                          <div key={stat.label} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glow)', borderRadius: '12px', padding: '16px 24px', flex: 1, textAlign: 'center' }}>
                            <div style={{ fontSize: '28px', fontWeight: '900', color: stat.color }}>{stat.count}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{stat.label}</div>
                          </div>
                        ))}
                      </div>
                      <div className="admin-table-container" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glow)', borderRadius: '16px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                          <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-glow)' }}>
                              {['Booker', 'Turf', 'Date & Time', 'Status', 'Requested At', 'Actions'].map(h => (
                                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '11px', textTransform: 'uppercase' }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {[...bookings].sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt)).map(b => {
                              const statusColor = b.status === 'pending_approval' ? 'orange' : b.status === 'completed' ? 'var(--accent-football)' : '#00bfff'
                              const dateText = b.dateFormatted || (dates[b.dateIndex] ? dates[b.dateIndex].formatted : '—')
                              return (
                                <tr key={b.id} style={{ borderBottom: '1px solid var(--border-glow)' }}>
                                  <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>{b.captainName}</td>
                                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Turf {b.turfId}</td>
                                  <td style={{ padding: '12px 16px' }}>{dateText} @ {b.time}</td>
                                  <td style={{ padding: '12px 16px' }}>
                                    <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '800', background: `${statusColor}22`, color: statusColor, border: `1px solid ${statusColor}44` }}>
                                      {b.status === 'booked_private' ? 'Approved' : b.status === 'booked_open' ? 'Open' : b.status.replace('_', ' ')}
                                    </span>
                                  </td>
                                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '11px' }}>{new Date(b.requestedAt).toLocaleString()}</td>
                                  <td style={{ padding: '12px 16px' }}>
                                    {b.status === 'pending_approval' && (
                                      <div style={{ display: 'flex', gap: '6px' }}>
                                        <button className="btn-approve" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={() => handleOwnerApproveBooking(b.id)}>✓ Approve</button>
                                        <button className="btn-reject" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={() => handleOwnerRejectBooking(b.id)}>✗ Reject</button>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* OWNERS TAB */}
                  {adminDashTab === 'owners' && (
                    <div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                        {profiles.filter(p => p.role === 'owner' || p.role === 'admin').map(owner => {
                          const isCurrent = owner.email === currentUser.email
                          const isAdmin = owner.role === 'admin'
                          return (
                            <div key={owner.id} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${isAdmin ? 'rgba(139,92,246,0.3)' : 'rgba(255,71,71,0.2)'}`, borderRadius: '16px', padding: '20px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: isAdmin ? 'rgba(139,92,246,0.15)' : 'rgba(255,71,71,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '900', color: isAdmin ? 'var(--accent-others)' : 'var(--accent-cricket)', border: `1px solid ${isAdmin ? 'rgba(139,92,246,0.3)' : 'rgba(255,71,71,0.2)'}` }}>
                                  {owner.name.charAt(0)}
                                </div>
                                <div>
                                  <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{owner.name} {isCurrent && <span style={{ fontSize: '9px', color: 'var(--accent-football)', background: 'rgba(0,255,115,0.1)', padding: '2px 6px', borderRadius: '4px' }}>YOU</span>}</div>
                                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{owner.email}</div>
                                </div>
                              </div>
                              <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', background: isAdmin ? 'rgba(139,92,246,0.15)' : 'rgba(255,71,71,0.1)', color: isAdmin ? 'var(--accent-others)' : 'var(--accent-cricket)', border: `1px solid ${isAdmin ? 'rgba(139,92,246,0.3)' : 'rgba(255,71,71,0.2)'}` }}>
                                {owner.role}
                              </span>
                            </div>
                          )
                        })}
                        {profiles.filter(p => p.role === 'owner' || p.role === 'admin').length === 0 && (
                          <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No owners registered yet.</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )

              // ── OWNER ───────────────────────────────────────────────────
              if (role === 'owner') {
                const pendingBookings = bookings.filter(b => b.status === 'pending_approval').sort((a, b) => new Date(a.requestedAt) - new Date(b.requestedAt))
                return (
                  <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,71,71,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '900', color: 'var(--accent-cricket)', border: '1px solid rgba(255,71,71,0.2)' }}>
                            {currentUser.name.charAt(0)}
                          </div>
                          <div>
                            <h1 style={{ fontSize: '24px', fontWeight: '900', fontFamily: 'var(--font-heading)' }}>{currentUser.name}</h1>
                            <span style={{ fontSize: '11px', color: 'var(--accent-cricket)', fontWeight: 'bold', textTransform: 'uppercase' }}>Venue Owner</span>
                          </div>
                        </div>
                      </div>
                      <button className="btn-login" onClick={() => { setViewingDashboard(false); setSelectedSport('cricket') }}>Book Turf</button>
                    </div>

                    {/* Quick stats */}
                    <div className="owner-stats-grid" style={{ marginBottom: '32px' }}>
                      {[
                        { label: 'Pending Approvals', value: pendingBookings.length, color: pendingBookings.length > 0 ? 'orange' : 'var(--text-muted)', emoji: '⏳' },
                        { label: 'Approved Today', value: bookings.filter(b => b.ownerApproved && b.dateIndex === 0).length, color: 'var(--accent-football)', emoji: '✅' },
                        { label: 'Total Groups', value: groups.length, color: 'var(--accent-others)', emoji: '👥' },
                      ].map(s => (
                        <div key={s.label} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glow)', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
                          <div style={{ fontSize: '24px', marginBottom: '6px' }}>{s.emoji}</div>
                          <div style={{ fontSize: '32px', fontWeight: '900', color: s.color, fontFamily: 'var(--font-heading)' }}>{s.value}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Approval Queue */}
                    <div style={{ marginBottom: '32px' }}>
                      <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        ⏳ Booking Approval Queue
                        {pendingBookings.length > 0 && <span style={{ background: 'orange', color: '#000', borderRadius: '20px', padding: '2px 10px', fontSize: '11px', fontWeight: '900' }}>{pendingBookings.length}</span>}
                      </h2>

                      {pendingBookings.length === 0 ? (
                        <div style={{ background: 'rgba(0,255,115,0.03)', border: '1px solid rgba(0,255,115,0.15)', borderRadius: '16px', padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                          <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
                          All clear — no pending approvals
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {pendingBookings.map((b, idx) => {
                            const dateText = b.dateFormatted || (dates[b.dateIndex] ? dates[b.dateIndex].formatted : 'Upcoming')
                            const minsAgo = Math.round((Date.now() - new Date(b.requestedAt)) / 60000)
                            const timeLabel = minsAgo < 60 ? `${minsAgo}m ago` : `${Math.round(minsAgo/60)}h ago`
                            // Check if another booking conflicts with this slot
                            const hasConflict = pendingBookings.some(other =>
                              other.id !== b.id && other.turfId === b.turfId && other.dateIndex === b.dateIndex && other.time === b.time
                            )
                            return (
                              <div key={b.id} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${hasConflict ? 'rgba(255,165,0,0.4)' : 'var(--border-glow)'}`, borderRadius: '16px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,165,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '16px', color: 'orange', border: '1px solid rgba(255,165,0,0.3)', flexShrink: 0 }}>
                                    {idx + 1}
                                  </div>
                                  <div>
                                    <div style={{ fontWeight: '800', fontSize: '15px' }}>{b.captainName}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                      {b.sportId === 'cricket' ? '🏏' : '⚽'} Turf {b.turfId} · {dateText} @ {b.time} · {b.duration}h
                                    </div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Requested {timeLabel}</div>
                                    {hasConflict && <div style={{ fontSize: '10px', color: 'orange', marginTop: '4px', fontWeight: 'bold' }}>⚠️ Slot conflict with another request</div>}
                                  </div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                  <button
                                    className="btn-approve"
                                    style={{ padding: '10px 20px', fontSize: '13px', fontWeight: '800', borderRadius: '10px' }}
                                    onClick={() => handleOwnerApproveBooking(b.id)}
                                  >
                                    ✓ Approve
                                  </button>
                                  <button
                                    className="btn-reject"
                                    style={{ padding: '10px 20px', fontSize: '13px', fontWeight: '800', borderRadius: '10px' }}
                                    onClick={() => handleOwnerRejectBooking(b.id)}
                                  >
                                    ✗ Reject
                                  </button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>

                    {/* Add Player Profile */}
                    <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glow)', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '14px' }}>➕ Add Player Profile</h3>
                      <form onSubmit={handleOwnerAdminCreateProfile} className="owner-add-player-form">
                        <input type="text" placeholder="Player Name" className="login-input" style={{ margin: 0 }} required value={newShadowName} onChange={e => setNewShadowName(e.target.value)} />
                        <input type="email" placeholder="Email (optional — leave blank for shadow player)" className="login-input" style={{ margin: 0 }} value={newShadowEmail} onChange={e => setNewShadowEmail(e.target.value)} />
                        <button type="submit" className="btn-cart-book" style={{ padding: '10px 20px', height: '44px' }}>Add</button>
                      </form>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>Leave email blank to create an offline shadow player (gets a claim code)</p>
                    </div>

                    {/* Floodlight settings */}
                    <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glow)', borderRadius: '16px', padding: '20px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '4px' }}>🔦 Floodlight Peak Rate Boundary</h3>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>Slots at or after this hour incur an extra ₹100/hour</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <select className="role-selector" value={floodlightStartHour} onChange={e => { setFloodlightStartHour(parseInt(e.target.value)); showToast(`Peak pricing now starts at ${e.target.value}:00`, 'info') }}>
                          <option value="17">05:00 PM</option>
                          <option value="18">06:00 PM</option>
                          <option value="19">07:00 PM</option>
                          <option value="20">08:00 PM</option>
                        </select>
                        <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--accent-football)' }}>
                          Current: {floodlightStartHour > 12 ? `${floodlightStartHour - 12}:00 PM` : `${floodlightStartHour}:00 AM`}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              }

              // ── PLAYER (default) ─────────────────────────────────────────
              return (
                <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
                  {/* Profile header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(0,255,115,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', fontWeight: '900', color: 'var(--accent-football)', border: '2px solid rgba(0,255,115,0.3)', flexShrink: 0 }}>
                        {currentUser.name.charAt(0)}
                      </div>
                      <div>
                        <h1 style={{ fontSize: '24px', fontWeight: '900', fontFamily: 'var(--font-heading)', marginBottom: '2px' }}>{currentUser.name}</h1>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '11px', color: 'var(--accent-football)', fontWeight: 'bold', textTransform: 'uppercase' }}>Player</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{currentUser.email}</span>
                        </div>
                      </div>
                    </div>
                    <button className="btn-book-action" style={{ padding: '10px 24px' }} onClick={() => { setViewingDashboard(false); setSelectedSport('cricket') }}>
                      + Book a Turf
                    </button>
                  </div>

                  {/* Stats bar */}
                  {currentUser.role === 'player' && (
                    <div className="player-stats-grid" style={{ marginBottom: '32px' }}>
                      {[
                        { label: 'Matches', value: currentUser.matches ?? myBookings.length, emoji: '🏆' },
                        { label: 'Runs', value: currentUser.runs ?? 0, emoji: '🏏' },
                        { label: 'Wickets', value: currentUser.wickets ?? 0, emoji: '🎯' },
                      ].map(s => (
                        <div key={s.label} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glow)', borderRadius: '14px', padding: '16px', textAlign: 'center' }}>
                          <div style={{ fontSize: '20px', marginBottom: '4px' }}>{s.emoji}</div>
                          <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--accent-football)', fontFamily: 'var(--font-heading)' }}>{s.value}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', textTransform: 'uppercase' }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upcoming matches */}
                  {upcomingBookings.length > 0 && (
                    <div style={{ marginBottom: '32px' }}>
                      <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        📅 Upcoming Matches
                      </h2>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {upcomingBookings.map(b => {
                          const dateText = dates[b.dateIndex] ? dates[b.dateIndex].formatted : 'Upcoming'
                          const statusColor = b.status === 'pending_approval' ? 'orange' : 'var(--accent-football)'
                          const statusLabel = b.status === 'pending_approval' ? 'Awaiting Approval' : b.status === 'booked_open' ? 'Open Match' : 'Confirmed'
                          return (
                            <div key={b.id} style={{ background: 'rgba(0,255,115,0.02)', border: '1px solid rgba(0,255,115,0.15)', borderRadius: '14px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                              <div>
                                <div style={{ fontWeight: '800', fontSize: '15px' }}>{b.teamName}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                                  {b.sportId === 'cricket' ? '🏏 Cricket' : '⚽ Football'} · Turf {b.turfId} · {dateText} @ {b.time} · {b.duration}h
                                </div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{b.playerCount} players registered</div>
                              </div>
                              <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: '800', background: `${statusColor}22`, color: statusColor, border: `1px solid ${statusColor}44`, whiteSpace: 'nowrap' }}>
                                {statusLabel}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Match history by date */}
                  <div style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      🗓️ Match History
                    </h2>

                    {myBookings.length === 0 ? (
                      <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glow)', borderRadius: '16px', padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏟️</div>
                        No matches yet. Book your first turf to get started!
                        <br />
                        <button className="btn-book-action" style={{ marginTop: '20px', padding: '10px 28px' }} onClick={() => { setViewingDashboard(false); setSelectedSport('cricket') }}>
                          Book Now
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {myBookings.map(booking => {
                          const isExpanded = expandedDayIndex === booking.id
                          const dateText = booking.dateFormatted || (dates[booking.dateIndex] ? dates[booking.dateIndex].formatted : 'Upcoming')
                          const isCricket = booking.sportId === 'cricket'
                          const statusColor = booking.status === 'completed' ? 'var(--accent-football)'
                            : booking.status === 'pending_approval' ? 'orange'
                            : '#00bfff'
                          const statusLabel = booking.status === 'booked_private' ? 'Approved'
                            : booking.status === 'booked_open' ? 'Open Match'
                            : booking.status === 'pending_approval' ? 'Pending Approval'
                            : booking.status

                          return (
                            <div key={booking.id} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glow)', borderRadius: '14px', overflow: 'hidden', transition: 'border-color 0.2s' }}>
                              {/* Row header */}
                              <div
                                style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                                onClick={() => setExpandedDayIndex(isExpanded ? null : booking.id)}
                              >
                                <div>
                                  <div style={{ fontWeight: '800', fontSize: '15px' }}>{dateText} @ {booking.time}</div>
                                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>
                                    {isCricket ? '🏏 Cricket' : '⚽ Football'} · Turf {booking.turfId} · {booking.teamName} · {booking.playerCount} players
                                  </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '800', background: `${statusColor}22`, color: statusColor, border: `1px solid ${statusColor}44`, whiteSpace: 'nowrap' }}>
                                    {statusLabel}
                                  </span>
                                  <span style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: 1 }}>{isExpanded ? '▲' : '▼'}</span>
                                </div>
                              </div>

                              {/* Expanded: scorecard */}
                              {isExpanded && (
                                <div style={{ borderTop: '1px solid var(--border-glow)', padding: '16px 20px', background: 'var(--bg-dark)' }}>
                                  {/* Team lineups */}
                                  <div className="match-lineups-grid" style={{ marginBottom: '16px' }}>
                                    {[
                                      { teamNum: 1, teamName: booking.scoreCard?.team1 || 'Team A', color: 'var(--accent-football)' },
                                      { teamNum: 2, teamName: booking.scoreCard?.team2 || 'Team B', color: 'var(--accent-cricket)' }
                                    ].map(({ teamNum, teamName, color }) => (
                                      <div key={teamNum} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glow)', borderRadius: '10px', padding: '12px' }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '13px', color, marginBottom: '8px', paddingBottom: '6px', borderBottom: '1px solid var(--border-glow)' }}>{teamName}</div>
                                        {booking.matchPlayers?.filter(p => p.team === teamNum).map((p, i) => (
                                          <div key={i} style={{ fontSize: '12px', padding: '2px 0', color: 'var(--text-main)' }}>• {p.name}</div>
                                        ))}
                                        {booking.matchPlayers?.filter(p => p.team === teamNum).length === 0 && (
                                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>No players assigned</div>
                                        )}
                                      </div>
                                    ))}
                                  </div>

                                  {/* Scorecard */}
                                  {booking.scoreCard && booking.scoreCard.result !== 'Match is scheduled' ? (
                                    <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-glow)', borderRadius: '10px', padding: '14px' }}>
                                      <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold', color: 'var(--accent-football)', marginBottom: '10px', letterSpacing: '0.5px' }}>Scorecard Summary</div>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <span style={{ fontWeight: 'bold' }}>{booking.scoreCard.team1}</span>
                                        <span style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '16px' }}>
                                          {booking.scoreCard.score1} {booking.scoreCard.overs1 ? `(${booking.scoreCard.overs1} ov)` : ''}
                                        </span>
                                      </div>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                        <span style={{ fontWeight: 'bold', color: 'var(--text-muted)' }}>{booking.scoreCard.team2}</span>
                                        <span style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '16px', color: 'var(--text-muted)' }}>
                                          {booking.scoreCard.score2} {booking.scoreCard.overs2 ? `(${booking.scoreCard.overs2} ov)` : ''}
                                        </span>
                                      </div>
                                      <div style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--accent-cricket)', fontSize: '13px', borderTop: '1px solid var(--border-glow)', paddingTop: '10px' }}>
                                        🏆 {booking.scoreCard.result}
                                      </div>

                                      {/* Aggregated Cricket Stats (if cricket and available) */}
                                      {booking.sportId === 'cricket' && (booking.scoreCard.battingStats || booking.scoreCard.bowlingStats) && (
                                        <div style={{ marginTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
                                          <div className="active-stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                            <div>
                                              <span style={{ fontSize: '11px', color: 'var(--accent-football)', fontWeight: 'bold', textTransform: 'uppercase' }}>Batting</span>
                                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                                                {Object.entries(booking.scoreCard.battingStats || {}).map(([player, s]) => (
                                                  <div key={player} style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between', color: 'var(--text-main)' }}>
                                                    <span>{player} {s.out ? '(out)' : '*'}</span>
                                                    <span style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{s.runs} runs ({s.balls}b)</span>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                            <div>
                                              <span style={{ fontSize: '11px', color: 'var(--accent-cricket)', fontWeight: 'bold', textTransform: 'uppercase' }}>Bowling</span>
                                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                                                {Object.entries(booking.scoreCard.bowlingStats || {}).map(([player, s]) => (
                                                  <div key={player} style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between', color: 'var(--text-main)' }}>
                                                    <span>{player}</span>
                                                    <span style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{s.wickets}W - {s.runs}R ({s.balls}b)</span>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          </div>
                                          {booking.scoreCard.extras && (
                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '10px', borderTop: '1px dashed rgba(255,255,255,0.06)', paddingTop: '6px' }}>
                                              Extras: Wides: {booking.scoreCard.extras.wides || 0} · No Balls: {booking.scoreCard.extras.noBalls || 0}
                                            </div>
                                          )}
                                        </div>
                                      )}

                                      {/* Aggregated Football Stats (if football and available) */}
                                      {booking.sportId === 'football' && booking.scoreCard?.goals && booking.scoreCard.goals.length > 0 && (
                                        <div style={{ marginTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px', textAlign: 'left' }}>
                                          <span style={{ fontSize: '11px', color: 'var(--accent-football)', fontWeight: 'bold', textTransform: 'uppercase' }}>Goals Timeline</span>
                                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                                            {booking.scoreCard.goals.map((g, idx) => (
                                              <div key={idx} style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between', color: 'var(--text-main)' }}>
                                                <span>⚽ {g.player} ({g.team === 1 ? booking.scoreCard.team1 : booking.scoreCard.team2})</span>
                                                <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>{g.minute}'</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '13px', padding: '12px' }}>
                                      No scorecard yet
                                    </div>
                                  )}

                                  {/* Captain controls */}
                                  {(booking.captainName === currentUser.name) && (isCricket || booking.sportId === 'football') && (
                                    <button
                                      className="btn-book-action"
                                      style={{ width: '100%', marginTop: '14px', padding: '11px', fontSize: '13px', fontWeight: '800' }}
                                      onClick={e => {
                                        e.stopPropagation()
                                        handleOpenScorecard(booking)
                                      }}
                                    >
                                      ⚡ Manage Live Scorecard
                                    </button>
                                  )}

                                  {/* Join requests (for captains) */}
                                  {booking.openToJoin && booking.joinRequests && booking.joinRequests.length > 0 && (
                                    <div style={{ marginTop: '14px', background: 'rgba(255,165,0,0.05)', border: '1px solid rgba(255,165,0,0.2)', borderRadius: '10px', padding: '12px' }}>
                                      <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'orange', marginBottom: '10px', textTransform: 'uppercase' }}>
                                        Join Requests ({booking.joinRequests.length})
                                      </div>
                                      {booking.joinRequests.map(req => (
                                        <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                          <div>
                                            <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{req.playerName}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{req.email} · {req.count} player(s)</div>
                                          </div>
                                          <div style={{ display: 'flex', gap: '6px' }}>
                                            <button className="btn-approve" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={e => { e.stopPropagation(); handleApproveJoinRequest(booking.id, req.id) }}>✓</button>
                                            <button className="btn-reject" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={e => { e.stopPropagation(); handleRejectJoinRequest(booking.id, req.id) }}>✗</button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* My Groups */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h2 style={{ fontSize: '18px', fontWeight: '800' }}>👥 My Groups</h2>
                    </div>

                    {/* Create group */}
                    <form onSubmit={handleCreateGroup} className="create-group-form" style={{ marginBottom: '20px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glow)', borderRadius: '14px', padding: '16px' }}>
                      <input type="text" placeholder="New group name..." className="login-input" style={{ margin: 0 }} value={newGroupName} onChange={e => setNewGroupName(e.target.value)} />
                      <select className="role-selector" value={newGroupSport} onChange={e => setNewGroupSport(e.target.value)} style={{ height: '44px' }}>
                        <option value="cricket">🏏 Cricket</option>
                        <option value="football">⚽ Football</option>
                        <option value="others">🏑 Others</option>
                      </select>
                      <button type="submit" className="btn-cart-book" style={{ padding: '10px 18px', height: '44px' }}>
                        + Create
                      </button>
                    </form>

                    {groups.filter(g => g.creator === currentUser.name || g.members.some(m => m.name === currentUser.name || (currentUser.email && m.email === currentUser.email))).length === 0 ? (
                      <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px', fontStyle: 'italic' }}>No groups yet. Create one above!</div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {groups.filter(g => g.creator === currentUser.name || g.members.some(m => m.name === currentUser.name || (currentUser.email && m.email === currentUser.email))).map(group => {
                          const canManage = currentUser.role === 'admin' || group.creator === currentUser.name
                          return (
                            <div key={group.id} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glow)', borderRadius: '14px', padding: '16px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <div>
                                  <span style={{ fontWeight: '800', fontSize: '16px' }}>{group.name}</span>
                                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: '10px' }}>by {group.creator}</span>
                                </div>
                                <span style={{ fontSize: '10px', color: 'var(--accent-football)', fontWeight: 'bold', textTransform: 'uppercase' }}>{group.sport}</span>
                              </div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: canManage ? '12px' : '0' }}>
                                {group.members.map((m, i) => (
                                  <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-glow)', borderRadius: '8px', padding: '5px 10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span>{m.name}</span>
                                    {m.isShadow && <span style={{ fontSize: '9px', color: 'var(--accent-cricket)', background: 'rgba(255,71,71,0.1)', padding: '1px 5px', borderRadius: '4px' }}>offline</span>}
                                    {canManage && group.creator !== m.name && (
                                      <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0', lineHeight: 1, fontSize: '13px' }} onClick={() => handleRemoveGroupMember(group.id, m.name)}>×</button>
                                    )}
                                  </div>
                                ))}
                              </div>
                              {canManage && (
                                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                  <select
                                    className="role-selector"
                                    style={{ flex: 1, padding: '6px 10px' }}
                                    defaultValue=""
                                    onChange={e => { if (e.target.value) { handleAddGroupMember(group.id, e.target.value); e.target.value = '' } }}
                                  >
                                    <option value="" disabled>Add player...</option>
                                    {profiles.filter(p => !group.members.some(m => m.name === p.name || (p.email && m.email === p.email))).map(p => (
                                      <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                  </select>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )
            })()}
          </div>
        ) : !selectedSport ? (
          <div className="home-container">
            <section className="hero-section">
              <h1 className="hero-title">Welcome to Smash & Roast</h1>
              <p className="hero-subtitle">Select a sport to find venue availability, join matches, or edit live scorecards</p>
            </section>

            {/* Live In-Progress Matches Section */}
            {inProgressMatches.length > 0 && (
              <section style={{ width: '100%', marginBottom: '40px', textAlign: 'left' }}>
                <h3 style={{ fontSize: '13px', fontWeight: '800', color: 'orange', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                  ⚡ Live Matches In Progress
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {inProgressMatches.map(b => {
                    const isCricket = b.sportId === 'cricket'
                    const scoreText = isCricket 
                      ? `${b.scoreCard?.score1 || '0/0'} vs ${b.scoreCard?.score2 || '0/0'}`
                      : `${b.scoreCard?.score1 || 0} - ${b.scoreCard?.score2 || 0}`
                    return (
                      <div key={b.id} style={{ background: 'rgba(255,165,0,0.03)', border: '1px solid rgba(255,165,0,0.25)', borderRadius: '16px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="status-dot" style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'red', animation: 'pulse 1.5s infinite' }}></span>
                            <span style={{ fontWeight: '800', fontSize: '16px' }}>{b.teamName} Live Match</span>
                          </div>
                          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                            {isCricket ? '🏏 Cricket' : '⚽ Football'} · Turf {b.turfId} · Score: <strong style={{ color: 'var(--text-main)', fontFamily: 'monospace', fontSize: '15px' }}>{scoreText}</strong>
                          </div>
                          {isCricket && b.scoreCard?.striker && (
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                              Striker: {b.scoreCard.striker} ({b.scoreCard.strikerRuns} runs) · Bowler: {b.scoreCard.bowler}
                            </div>
                          )}
                        </div>
                        <button 
                          className="btn-book-action" 
                          style={{ width: 'auto', padding: '10px 24px', background: 'linear-gradient(135deg, orange 0%, #ff4747 100%)', color: '#000', fontSize: '13px' }}
                          onClick={() => handleOpenScorecard(b)}
                        >
                          ⚡ Track Records
                        </button>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            <section className="sports-grid">
              {sports.map((sport) => (
                <div
                  key={sport.id}
                  className={`sport-card ${sport.className}`}
                  onClick={() => handleSportSelect(sport.id)}
                >
                  <div
                    className="sport-card-bg"
                    style={{ backgroundImage: `url(${sport.bg})` }}
                  />
                  <div className="sport-card-content">
                    <span className="sport-tag">{sport.tag}</span>
                    <h2 className="sport-title">{sport.title}</h2>
                    <p className="sport-desc">{sport.desc}</p>
                  </div>
                </div>
              ))}
            </section>
          </div>
        ) : (
          <div>
            {/* Sport Hero Area */}
            <header className="sport-subpage-hero" style={{ backgroundImage: `url(${activeSport.bg})` }}>
              <div className="sport-subpage-hero-content">
                <span className="subpage-tag">{activeSport.tag}</span>
                <h1 className="hero-title">{activeSport.title}</h1>
                <p className="hero-subtitle">{activeSport.desc}</p>
              </div>
            </header>

            {/* Interactive Timeline & Blueprint Selector */}
            <section className="booking-section" id="booking-view">
              
              {/* Left Column: Blueprint Map and Slot Grid */}
              <div className="booking-main-panel">
                <h2 className="panel-title">
                  <MapPin size={20} className="logo-icon" /> Smash & Roast Arena Map
                </h2>
                
                {/* Blueprint map */}
                <div className="venue-map-container">
                  <div className="venue-map-label">Interactive Field Selection (Click to Toggle)</div>
                  <div className="blueprint-layout">
                    <div className="blueprint-left">
                      <div className="blueprint-block">
                        <div className="blueprint-label">Entrance Gate</div>
                      </div>
                      <div className="blueprint-block cafe">
                        <div className="blueprint-label">Cafeteria</div>
                      </div>
                    </div>
                    <div className="blueprint-right">
                      <div 
                        className={`blueprint-turf-card ${selectedTurf === 2 ? 'active' : ''}`}
                        onClick={() => { setSelectedTurf(2); setSelectedHours([]); }}
                      >
                        <div className="blueprint-label">Turf 2 (Top)</div>
                        <div className="blueprint-sublabel">AstroTurf Pitch</div>
                        <div style={{
                          fontSize: '11px',
                          marginTop: '6px',
                          color: selectedTurf === 2 ? '#050608' : '#00dc64',
                          fontWeight: '800',
                          background: selectedTurf === 2 ? '#00dc64' : 'rgba(0, 220, 100, 0.1)',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          display: 'inline-block'
                        }}>
                          {getAvailableSlotsCount(2)} slots left
                        </div>
                      </div>
                      <div 
                        className={`blueprint-turf-card ${selectedTurf === 1 ? 'active' : ''}`}
                        onClick={() => { setSelectedTurf(1); setSelectedHours([]); }}
                      >
                        <div className="blueprint-label">Turf 1 (Bottom)</div>
                        <div className="blueprint-sublabel">Clay Pitch</div>
                        <div style={{
                          fontSize: '11px',
                          marginTop: '6px',
                          color: selectedTurf === 1 ? '#050608' : '#00dc64',
                          fontWeight: '800',
                          background: selectedTurf === 1 ? '#00dc64' : 'rgba(0, 220, 100, 0.1)',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          display: 'inline-block'
                        }}>
                          {getAvailableSlotsCount(1)} slots left
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Date Picker */}
                <h2 className="panel-title">
                  <CalendarIcon size={18} className="logo-icon" /> Choose Date
                </h2>
                <div className="date-selector-container">
                  {dates.map((date, idx) => (
                    <button
                      key={idx}
                      className={`date-btn ${selectedDateIndex === idx ? 'active' : ''}`}
                      onClick={() => { setSelectedDateIndex(idx); setSelectedHours([]); }}
                    >
                      <span className="date-day">{date.dayName}</span>
                      <span className="date-num">{date.num}</span>
                    </button>
                  ))}
                </div>

                {/* Slots Grid */}
                <h2 className="panel-title">
                  <Clock size={18} className="logo-icon" /> Time Slots (Click to Select / Deselect Consecutive Hours)
                </h2>
                
                <div className="slots-container">
                  {/* ── My Bookings Today strip ── */}
                  {(() => {
                    const myBookingsToday = isLoggedIn && currentUser
                      ? bookings.filter(b =>
                          b.turfId === selectedTurf &&
                          b.dateIndex === selectedDateIndex &&
                          b.status !== 'rejected' && b.status !== 'cancelled' &&
                          (b.captainName === currentUser.name ||
                           b.booker_id === currentUser.id ||
                           (b.matchPlayers && b.matchPlayers.some(p => p.name === currentUser.name || (p.email && currentUser.email && p.email === currentUser.email))))
                        )
                      : []
                    if (!myBookingsToday.length) return null
                    return (
                      <div style={{
                        marginBottom: '20px',
                        background: 'linear-gradient(135deg, rgba(0,220,100,0.07) 0%, rgba(255,215,0,0.05) 100%)',
                        border: '1px solid rgba(0,220,100,0.25)',
                        borderRadius: '14px',
                        padding: '14px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        flexWrap: 'wrap'
                      }}>
                        <span style={{ fontSize: '22px', flexShrink: 0 }}>🎉</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '12px', fontWeight: '800', color: '#00dc64', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>
                            Your Booking{myBookingsToday.length > 1 ? 's' : ''} on This Turf
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {myBookingsToday.map(b => (
                              <span key={b.id} style={{
                                fontSize: '11px',
                                background: 'rgba(0,220,100,0.12)',
                                border: '1px solid rgba(0,220,100,0.3)',
                                borderRadius: '20px',
                                padding: '3px 10px',
                                color: '#e8f5e8',
                                fontWeight: '600',
                                display: 'flex', alignItems: 'center', gap: '5px',
                                cursor: 'pointer'
                              }}
                              onClick={() => {
                                setSelectedBookedSlotId(b.id)
                                setSelectedHours([])
                              }}>
                                {b.sportId === 'cricket' ? '🏏' : b.sportId === 'football' ? '⚽' : '🏆'}
                                {b.time}
                                {b.duration > 1 ? ` — ${b.duration}h` : ''}
                                {b.status === 'pending_approval'
                                  ? <span style={{ color: 'orange' }}> · Pending ⏳</span>
                                  : <span style={{ color: '#00dc64' }}> · Confirmed ✓</span>}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })()}

                  {['Morning', 'Afternoon', 'Evening', 'Night'].map((period) => {
                    const periodSlots = slotsData.filter(s => s.period === period)
                    return (
                      <div key={period}>
                        <h3 className="slots-section-title" style={{ marginBottom: '8px' }}>{period} Slots</h3>
                        <div className="slots-grid">
                          {periodSlots.map((slot) => {
                            const isBooked = currentBookedHours.has(slot.hourValue)
                            const isSelected = selectedHours.includes(slot.hourValue)

                            let btnClass = 'available'
                            let statusText = 'Available'
                            let bookingItem = null

                            if (isBooked) {
                              bookingItem = bookings.find(b => {
                                if (b.turfId === selectedTurf && b.dateIndex === selectedDateIndex) {
                                  if (b.status !== 'rejected' && b.status !== 'cancelled') {
                                    const bStart = slotsData.find(s => s.time === b.time)
                                    if (bStart) {
                                      return slot.hourValue >= bStart.hourValue && slot.hourValue < bStart.hourValue + b.duration
                                    }
                                  }
                                }
                                return false
                              })

                              if (bookingItem?.status === 'pending_approval') {
                                btnClass = 'private_booked'
                                statusText = 'Pending Approval'
                              } else {
                                btnClass = 'private_booked'
                                statusText = 'Booked'
                              }
                            }

                            let btnStyle = { 
                              borderColor: isSelected ? 'var(--accent-football)' : '',
                              backgroundColor: isSelected ? 'rgba(0, 255, 102, 0.08)' : '',
                              opacity: isBooked ? (bookingItem?.openToJoin ? 0.85 : 0.35) : 1,
                              cursor: isBooked ? (bookingItem?.openToJoin ? 'pointer' : 'not-allowed') : 'pointer'
                            }

                            if (isBooked && bookingItem) {
                              btnStyle.opacity = 0.95
                              btnStyle.position = 'relative'
                              btnStyle.overflow = 'hidden'
                              btnStyle.color = 'var(--text-main)'
                              btnStyle.textShadow = '0 1px 4px rgba(0,0,0,0.95)'
                              btnStyle.backgroundSize = 'cover'
                              btnStyle.backgroundPosition = 'center'

                              if (bookingItem.sportId === 'cricket') {
                                btnStyle.backgroundImage = `linear-gradient(rgba(5, 6, 8, 0.75), rgba(5, 6, 8, 0.75)), url(${cricketSlotBg})`
                                btnStyle.borderColor = 'rgba(255, 71, 71, 0.4)'
                              } else if (bookingItem.sportId === 'football') {
                                btnStyle.backgroundImage = `linear-gradient(rgba(5, 6, 8, 0.75), rgba(5, 6, 8, 0.75)), url(${footballSlotBg})`
                                btnStyle.borderColor = 'rgba(0, 255, 115, 0.4)'
                              } else {
                                btnStyle.backgroundImage = `linear-gradient(rgba(5, 6, 8, 0.8), rgba(5, 6, 8, 0.8)), url(${othersBg})`
                                btnStyle.borderColor = 'rgba(139, 92, 246, 0.4)'
                              }
                            }

                            // ── Detect if this slot belongs to the current user ──
                            const isMyBooking = isLoggedIn && currentUser && bookingItem &&
                              (bookingItem.captainName === currentUser.name ||
                               bookingItem.booker_id === currentUser.id ||
                               (bookingItem.matchPlayers && bookingItem.matchPlayers.some(p =>
                                 p.name === currentUser.name || (p.email && currentUser.email && p.email === currentUser.email)
                               )))

                            // ── Override: my booking gets special glow treatment ──
                            if (isMyBooking) {
                              btnStyle.opacity = 1
                              btnStyle.cursor = 'pointer'
                              btnStyle.border = '1.5px solid rgba(0,220,100,0.85)'
                              btnStyle.boxShadow = '0 0 14px rgba(0,220,100,0.35), inset 0 0 20px rgba(0,220,100,0.06)'
                              if (bookingItem.status === 'pending_approval') {
                                btnStyle.border = '1.5px solid rgba(255,170,0,0.85)'
                                btnStyle.boxShadow = '0 0 14px rgba(255,170,0,0.3), inset 0 0 20px rgba(255,170,0,0.06)'
                              }
                            }

                            return (
                              <button
                                key={slot.time}
                                className={`slot-btn ${btnClass} ${isSelected ? 'active' : ''}`}
                                onClick={() => handleSlotClick(slot)}
                                style={btnStyle}
                                disabled={isBooked && !bookingItem?.openToJoin && !isMyBooking}
                              >
                                <span className="slot-time">{slot.time}</span>
                                {isMyBooking ? (
                                  <span style={{
                                    fontSize: '9px',
                                    fontWeight: '800',
                                    marginTop: '4px',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    background: bookingItem.status === 'pending_approval'
                                      ? 'rgba(255,170,0,0.2)'
                                      : 'rgba(0,220,100,0.2)',
                                    color: bookingItem.status === 'pending_approval' ? '#ffaa00' : '#00dc64',
                                    letterSpacing: '0.3px',
                                    display: 'flex', alignItems: 'center', gap: '3px'
                                  }}>
                                    {bookingItem.status === 'pending_approval' ? '⏳ Pending' : '🎉 Yours!'}
                                  </span>
                                ) : (
                                  <span className="slot-status-badge">{statusText}</span>
                                )}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Right Column: Reservation form */}
              <div className="booking-side-panel">
                <h2 className="panel-title">
                  <Layers size={20} className="logo-icon" /> Booking Configuration
                </h2>

                {selectedBookedSlotId ? (() => {
                  const b = bookings.find(item => item.id === selectedBookedSlotId)
                  if (!b) return null

                  const alreadyRequested = currentUser ? b.joinRequests.some(r => r.playerName === currentUser.name) : false
                  const isCaptain = currentUser ? (b.captainName === currentUser.name || (currentUser.name.includes('Rahul') && b.captainName.includes('Rahul'))) : false

                  return (
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px', color: 'var(--accent-football)' }}>
                        Open Match: {b.teamName}
                      </h3>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                        This slot has been booked as an open match. You can request to join this group.
                      </p>

                      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glow)', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Captain:</span>
                          <span style={{ fontWeight: 'bold' }}>{b.captainName}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Time Slot:</span>
                          <span style={{ fontWeight: 'bold' }}>{b.time} ({b.duration} {b.duration === 1 ? 'hour' : 'hours'})</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Current Players Count:</span>
                          <span style={{ fontWeight: 'bold', color: 'var(--accent-football)' }}>{b.playerCount} Players</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Open for Join Requests:</span>
                          <span style={{ fontWeight: 'bold', color: 'var(--accent-football)' }}>Yes</span>
                        </div>
                      </div>

                      {/* Display Lineups for Open Match */}
                      <div style={{ background: 'var(--bg-dark)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-glow)', marginBottom: '16px', textAlign: 'left' }}>
                        <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold', color: 'var(--accent-football)', marginBottom: '6px', textAlign: 'center' }}>
                          Current Match Lineups
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          <div>
                            <div style={{ fontSize: '10px', fontWeight: 'bold', borderBottom: '1px solid var(--border-glow)', paddingBottom: '2px', marginBottom: '4px' }}>
                              {b.scoreCard?.team1 || 'Team A'}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '10px', color: 'var(--text-muted)' }}>
                              {b.matchPlayers?.filter(p => p.team === 1).map((p, idx) => (
                                <span key={idx}>• {p.name}</span>
                              ))}
                              {b.matchPlayers?.filter(p => p.team === 1).length === 0 && <span style={{ fontStyle: 'italic' }}>Empty</span>}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '10px', fontWeight: 'bold', borderBottom: '1px solid var(--border-glow)', paddingBottom: '2px', marginBottom: '4px' }}>
                              {b.scoreCard?.team2 || 'Team B'}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '10px', color: 'var(--text-muted)' }}>
                              {b.matchPlayers?.filter(p => p.team === 2).map((p, idx) => (
                                <span key={idx}>• {p.name}</span>
                              ))}
                              {b.matchPlayers?.filter(p => p.team === 2).length === 0 && <span style={{ fontStyle: 'italic' }}>Empty</span>}
                            </div>
                          </div>
                        </div>
                      </div>

                      {isCaptain ? (
                        <div style={{ background: 'rgba(0, 255, 102, 0.05)', border: '1px solid rgba(0, 255, 102, 0.2)', padding: '12px', borderRadius: '8px', fontSize: '13px', textAlign: 'center' }}>
                          You are the Captain of this booking. View join requests in your Dashboard.
                        </div>
                      ) : alreadyRequested ? (
                        <div style={{ background: 'rgba(255, 165, 0, 0.05)', border: '1px solid rgba(255, 165, 0, 0.2)', padding: '12px', borderRadius: '8px', fontSize: '13px', textAlign: 'center', color: 'orange', fontWeight: 'bold' }}>
                          Join Request Pending Approval
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
                            <input 
                              type="checkbox" 
                              id="acceptJoinTerms"
                              checked={acceptJoinTerms} 
                              onChange={(e) => setAcceptJoinTerms(e.target.checked)} 
                              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <label htmlFor="acceptJoinTerms" style={{ fontSize: '12px', color: 'var(--text-main)', cursor: 'pointer', userSelect: 'none' }}>
                              I request to join this match slot
                            </label>
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left', marginTop: '4px' }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Players coming (including you):</span>
                            <input 
                              type="number" 
                              min="1" 
                              max="11" 
                              value={guestPlayersCount} 
                              className="role-selector"
                              style={{ width: '60px', padding: '4px 8px', borderRadius: '4px' }}
                              onChange={(e) => setGuestPlayersCount(Math.max(1, parseInt(e.target.value, 10) || 1))} 
                            />
                          </div>

                          <button 
                            className="btn-book-action" 
                            style={{ 
                              marginTop: '12px', 
                              opacity: acceptJoinTerms ? 1 : 0.5, 
                              cursor: acceptJoinTerms ? 'pointer' : 'not-allowed',
                              background: acceptJoinTerms ? '' : 'var(--text-muted)' 
                            }}
                            disabled={!acceptJoinTerms}
                            onClick={() => {
                              handleJoinMatchRequest(b.id, guestPlayersCount);
                              setAcceptJoinTerms(false);
                              setGuestPlayersCount(1);
                            }}
                          >
                            Submit Join Request
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })() : activeSlotDetail ? (
                  !isLoggedIn ? (
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glow)', padding: '24px', borderRadius: '12px', textAlign: 'center' }}>
                      <Lock size={36} style={{ color: 'var(--accent-cricket)', marginBottom: '12px', opacity: 0.8 }} />
                      <h4 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '8px' }}>Sign In Required</h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Only logged in players can book slots at Smash & Roast Arena.</p>
                      <button className="btn-book-action" style={{ padding: '10px 20px', fontSize: '13px' }} onClick={() => { setShowLoginModal(true); setAuthTab('login'); }}>Sign In / Register</button>
                    </div>
                  ) : (
                    <div>
                      {/* Booking Form Details */}
                      <div>
                        {/* Profile Name Display */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0, 255, 102, 0.05)', border: '1px solid rgba(0, 255, 102, 0.15)', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px' }}>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Booking as:</span>
                          <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--accent-football)' }}>{currentUser.name}</span>
                        </div>

                        {/* Booking form fields */}
                        <div className="booking-form-group">
                          
                          {/* Booking Groups Dropdown Selector */}
                          <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'bold' }}>Select Booking Group</label>
                          <select 
                            className="role-selector"
                            style={{ width: '100%', padding: '10px', borderRadius: '8px' }}
                            value={selectedGroupName}
                            onChange={(e) => setSelectedGroupName(e.target.value)}
                          >
                            {userGroupsList.map(groupName => (
                              <option key={groupName} value={groupName}>{groupName}</option>
                            ))}
                          </select>

                          {/* Player Count coming */}
                          <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'bold', marginTop: '6px' }}>Number of Players Coming</label>
                          <input 
                            type="number" 
                            min="1"
                            max="22"
                            className="role-selector" 
                            style={{ width: '100%', padding: '10px', borderRadius: '8px' }}
                            value={numPlayers} 
                            onChange={(e) => setNumPlayers(parseInt(e.target.value, 10) || 8)} 
                          />
                          
                          {/* Allow others to join toggle */}
                          <div className="booking-toggle" style={{ marginTop: '12px', borderTop: '1px solid var(--border-glow)', paddingTop: '12px' }}>
                            <div>
                              <span style={{ fontSize: '13px', fontWeight: '600' }}>Open to Join Match</span>
                              <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Allow other nearby users to join this booking slot</p>
                            </div>
                            <label className="toggle-switch">
                              <input 
                                type="checkbox" 
                                checked={isOpenToJoinToggle} 
                                onChange={(e) => setIsOpenToJoinToggle(e.target.checked)} 
                              />
                              <span className="toggle-slider"></span>
                            </label>
                          </div>
                        </div>

                        {/* Equipment Rentals / Add-ons Checklist */}
                        <h3 className="slots-section-title" style={{ marginTop: '24px', marginBottom: '8px' }}>Equipment Add-ons</h3>
                        <div className="booking-form-group">
                          
                          {selectedSport === 'cricket' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                                <input 
                                  type="checkbox" 
                                  checked={cricketAddons.bats} 
                                  onChange={(e) => setCricketAddons(prev => ({ ...prev, bats: e.target.checked }))} 
                                />
                                Rent Bats (+Rs. 100)
                              </label>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                                <input 
                                  type="checkbox" 
                                  checked={cricketAddons.balls} 
                                  onChange={(e) => setCricketAddons(prev => ({ ...prev, balls: e.target.checked }))} 
                                />
                                Leather / Tennis Balls (+Rs. 50)
                              </label>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                                <input 
                                  type="checkbox" 
                                  checked={cricketAddons.wickets} 
                                  onChange={(e) => setCricketAddons(prev => ({ ...prev, wickets: e.target.checked }))} 
                                />
                                Stumps Setup (+Rs. 50)
                              </label>
                            </div>
                          )}

                          {selectedSport === 'football' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                                <input 
                                  type="checkbox" 
                                  checked={footballAddons.nets} 
                                  onChange={(e) => setFootballAddons(prev => ({ ...prev, nets: e.target.checked }))} 
                                />
                                Goal Nets Setup (+Rs. 150)
                              </label>
                            </div>
                          )}

                          {/* All sports Water bottles */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border-glow)', paddingTop: '10px', marginTop: '4px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                              <input 
                                type="checkbox" 
                                checked={waterAddon} 
                                onChange={(e) => setWaterAddon(e.target.checked)} 
                              />
                              Mineral Water Bottles (+Rs. 20/bottle)
                            </label>
                            {waterAddon && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '22px' }}>
                                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Quantity:</span>
                                <input 
                                  type="number" 
                                  min="1" 
                                  max="20"
                                  value={waterQty} 
                                  className="role-selector"
                                  style={{ width: '60px', padding: '4px 8px', borderRadius: '4px' }}
                                  onChange={(e) => setWaterQty(parseInt(e.target.value, 10) || 1)} 
                                />
                              </div>
                            )}
                          </div>

                        </div>

                        {/* Pricing summary */}
                        <h3 className="slots-section-title" style={{ marginTop: '24px', marginBottom: '8px' }}>Live Pricing Breakdown</h3>
                        <div className="details-list" style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-glow)' }}>
                          {pricingData.items.map((item, idx) => (
                            <div className="detail-item" key={idx} style={{ borderBottom: 'none', paddingBottom: '4px' }}>
                              <span className="detail-label">{item.slotLabel}</span>
                              <span className="detail-val">Rs. {item.price}</span>
                            </div>
                          ))}
                          {pricingData.addonCost > 0 && (
                            <div className="detail-item" style={{ borderBottom: 'none', paddingBottom: '4px' }}>
                              <span className="detail-label">Add-ons / Rentals</span>
                              <span className="detail-val">Rs. {pricingData.addonCost}</span>
                            </div>
                          )}
                        </div>
                    </div>
                  </div>
                )) : (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                    <Clock size={40} style={{ marginBottom: '12px', opacity: '0.4' }} />
                    <p>Click directly on slot buttons to select and deselect consecutive hours. The total price adjusts dynamically.</p>
                  </div>
                )}
              </div>

            </section>

            {/* Sticky Bottom Cart Bar */}
            {selectedHours.length > 0 && (
              <div className="cart-sticky-bottom">
                <div className="cart-left">
                  <div className="cart-title">Turf {selectedTurf} ({activeSport.title})</div>
                  <div className="cart-summary">
                    <span className="cart-hours">{selectedHours.length} {selectedHours.length === 1 ? 'Hour' : 'Hours'} Booked</span>
                    <span className="cart-divider">•</span>
                    <div>
                      <span className="cart-price">Rs. {pricingData.total}</span>
                      {numPlayers > 0 && (
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          (Approx. Rs. {Math.round(pricingData.total / numPlayers)} / player)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="cart-actions">
                  <button className="btn-cart-book" onClick={handleCreateBooking}>
                    Book Now
                  </button>
                </div>
              </div>
            )}

        {/* CRICKET SCORECARD MANAGER MODAL */}
        {activeScorecardBookingId && (() => {
          const booking = bookings.find(b => b.id === activeScorecardBookingId)
          if (!booking) return null

          // Handle Drag and Drop events
          const handleDragStart = (e, playerName) => {
            e.dataTransfer.setData("playerName", playerName)
          }

          const handleDrop = (e, targetTeam) => {
            e.preventDefault()
            const playerName = e.dataTransfer.getData("playerName")
            if (playerName) {
              handleAssignMatchPlayerTeam(booking.id, playerName, targetTeam)
            }
          }

          const handleDragOver = (e) => {
            e.preventDefault()
          }

          const handleStartToss = () => {
            setScorecardStep('toss')
          }

          const handleConfirmFootballRoster = () => {
            const team1Name = booking.teamName || 'Team A'
            const team2Name = 'Opponent Team'
            handleUpdateScorecard(booking.id, {
              team1: team1Name,
              team2: team2Name,
              score1: 0,
              score2: 0,
              goals: [],
              result: `In progress: ${team1Name} 0 - 0 ${team2Name}`
            })

            // Mark match as started
            setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, matchStarted: true } : b))

            if (isSupabaseConfigured) {
              const syncScorecardInit = async () => {
                try {
                  await supabase
                    .from('match_scores')
                    .upsert({
                      booking_id: booking.id,
                      team1_name: team1Name,
                      team2_name: team2Name,
                      team1_score: 0,
                      team2_score: 0,
                      is_live: true,
                      ball_by_ball: []
                    }, { onConflict: 'booking_id' });
                } catch (e) {
                  console.error('Error initializing football scorecard on Supabase:', e);
                }
              };
              syncScorecardInit();
            }

            setScorecardStep('scoring')
          }

          const handleAddFootballGoal = async (teamNum) => {
            const teamPlayers = teamNum === 1 ? teamAPlayers : teamBPlayers
            const defaultScorerName = teamPlayers[0]?.name || (teamNum === 1 ? 'Team A Player' : 'Team B Player')
            const scorerName = await showPrompt(
              `Enter goal scorer's name for ${teamNum === 1 ? (booking.scoreCard?.team1 || 'Team A') : (booking.scoreCard?.team2 || 'Team B')}.\nAvailable players: ` +
              teamPlayers.map(p => p.name).join(', '),
              defaultScorerName,
              'Scorer name'
            )
            if (scorerName === null) return // cancelled

            const minuteStr = await showPrompt("Enter goal minute (1 - 90):", "15", "Goal minute")
            if (minuteStr === null) return // cancelled
            const minute = parseInt(minuteStr, 10) || 15

            const sc = booking.scoreCard || { team1: booking.teamName || 'Team A', team2: 'Opponent Team', score1: 0, score2: 0, goals: [] }
            const newScore1 = teamNum === 1 ? (parseInt(sc.score1 || 0, 10) + 1) : (parseInt(sc.score1 || 0, 10))
            const newScore2 = teamNum === 2 ? (parseInt(sc.score2 || 0, 10) + 1) : (parseInt(sc.score2 || 0, 10))
            const newGoals = [...(sc.goals || []), { team: teamNum, player: scorerName, minute }]

            handleUpdateScorecard(booking.id, {
              score1: newScore1,
              score2: newScore2,
              goals: newGoals,
              result: `In progress: ${booking.scoreCard?.team1 || 'Team A'} ${newScore1} - ${newScore2} ${booking.scoreCard?.team2 || 'Team B'}`
            })
          }

          const handleEndFootballMatch = () => {
            const sc = booking.scoreCard
            const score1 = parseInt(sc.score1 || 0, 10)
            const score2 = parseInt(sc.score2 || 0, 10)
            const team1Name = sc.team1 || booking.teamName || 'Team A'
            const team2Name = sc.team2 || 'Opponent Team'

            let resultText = ''
            if (score1 > score2) {
              resultText = `${team1Name} won ${score1} - ${score2}`
            } else if (score2 > score1) {
              resultText = `${team2Name} won ${score2} - ${score1}`
            } else {
              resultText = `Match tied ${score1} - ${score2}`
            }

            showAlert(`Match ended!\n${resultText}`, 'Match Completed')
            handleUpdateScorecard(booking.id, {
              result: resultText,
              isCompleted: true
            })

            // Also update status of booking to completed
            setBookings(prev => prev.map(b => {
              if (b.id === booking.id) {
                return { ...b, status: 'completed' }
              }
              return b
            }))
            setActiveScorecardBookingId(null)
          }

          const handleCoinFlip = () => {
            setTossCoinState({ spinning: true, winner: null, choice: null, showModal: true })
            setTimeout(() => {
              const randWinner = Math.random() < 0.5 ? 1 : 2
              const choices = ['Batting', 'Bowling']
              const randChoice = choices[Math.floor(Math.random() * choices.length)]
              
              setTossCoinState({
                spinning: false,
                winner: randWinner,
                choice: randChoice,
                showModal: true
              })
              setTossWinnerOverride(randWinner)
              setTossChoiceOverride(randChoice)

              setTimeout(() => {
                setTossCoinState(prev => ({ ...prev, showModal: false }))
              }, 3000)
            }, 2500)
          }

          const handleAcceptToss = () => {
            const team1Name = booking.teamName || 'Team A'
            const team2Name = 'Opponent Team'

            const isT1Batting = (tossWinnerOverride === 1 && tossChoiceOverride === 'Batting') || 
                                (tossWinnerOverride === 2 && tossChoiceOverride === 'Bowling')

            handleUpdateScorecard(booking.id, {
              team1: team1Name,
              team2: team2Name,
              tossWinner: tossWinnerOverride === 1 ? 'Team A' : 'Team B',
              tossChoice: tossChoiceOverride,
              battingTeam: isT1Batting ? 1 : 2,
              matchOvers: parseInt(matchOversInput, 10) || 6,
              singleBattingAllowed: singleBattingInput,
              undoStack: []
            })
            
            setScorecardStep('setup')
          }

          const handleSetupPlayers = (e) => {
            e.preventDefault()
            if (!batsmanStriker || !batsmanNonStriker || !currentBowler) {
              showToast('Please select Striker, Non-Striker, and Bowler!', 'error')
              return
            }
            if (batsmanStriker === batsmanNonStriker) {
              showToast('Striker and Non-Striker cannot be the same player!', 'error')
              return
            }

            handleUpdateScorecard(booking.id, {
              striker: batsmanStriker,
              nonStriker: batsmanNonStriker,
              bowler: currentBowler,
              strikerRuns: 0,
              strikerBalls: 0,
              nonStrikerRuns: 0,
              nonStrikerBalls: 0,
              bowlerRuns: 0,
              bowlerBalls: 0,
              bowlerWickets: 0,
              ballsThisOver: [],
              battingStats: {
                [batsmanStriker]: { runs: 0, balls: 0, out: false },
                [batsmanNonStriker]: { runs: 0, balls: 0, out: false }
              },
              bowlingStats: {
                [currentBowler]: { runs: 0, balls: 0, wickets: 0 }
              },
              extras: { wides: 0, noBalls: 0 }
            })

            // Mark match as started
            setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, matchStarted: true } : b))

            if (isSupabaseConfigured) {
              const syncScorecardInit = async () => {
                try {
                  await supabase
                    .from('match_scores')
                    .upsert({
                      booking_id: booking.id,
                      team1_name: booking.teamName || 'Team A',
                      team2_name: 'Opponent Team',
                      team1_score: 0,
                      team2_score: 0,
                      is_live: true,
                      ball_by_ball: []
                    }, { onConflict: 'booking_id' });
                } catch (e) {
                  console.error('Error initializing scorecard on Supabase:', e);
                }
              };
              syncScorecardInit();
            }

            setScorecardStep('scoring')
          }

          const sc = booking.scoreCard

          const deepCopyScorecard = (card) => {
            if (!card) return null
            return {
              ...card,
              battingStats: card.battingStats ? JSON.parse(JSON.stringify(card.battingStats)) : {},
              bowlingStats: card.bowlingStats ? JSON.parse(JSON.stringify(card.bowlingStats)) : {},
              extras: card.extras ? { ...card.extras } : { wides: 0, noBalls: 0 },
              ballsThisOver: card.ballsThisOver ? [...card.ballsThisOver] : [],
              undoStack: []
            }
          }

          const getAvailableBatsmen = (excludeName) => {
            if (!sc || !sc.battingStats) {
              return battingPlayersList.filter(p => p.name !== excludeName)
            }
            return battingPlayersList.filter(p => {
              if (p.name === excludeName) return false
              const stats = sc.battingStats[p.name]
              if (!stats) return true
              if (stats.out) return false
              if (stats.retired && !stats.out) return true
              if (p.name === sc.striker || p.name === sc.nonStriker) return false
              return false
            })
          }

          const triggerDeclareInnings = (updatedSc) => {
            const scorecard = updatedSc
            if (scorecard.battingTeam === 1) {
              showAlert('First innings ended! Swapping batting team.', 'Innings Over')
              handleUpdateScorecard(booking.id, {
                ...updatedSc,
                battingTeam: 2,
                striker: '',
                nonStriker: '',
                bowler: '',
                strikerRuns: 0,
                strikerBalls: 0,
                nonStrikerRuns: 0,
                nonStrikerBalls: 0,
                bowlerBalls: 0,
                bowlerRuns: 0,
                bowlerWickets: 0,
                ballsThisOver: []
              })
              setBatsmanStriker('')
              setBatsmanNonStriker('')
              setCurrentBowler('')
              setScorecardStep('setup')
            } else {
              const runs1 = parseInt(scorecard.score1.split('/')[0], 10) || 0
              const runs2 = parseInt(scorecard.score2.split('/')[0], 10) || 0
              let resultText = ''
              if (runs1 > runs2) {
                resultText = `${scorecard.team1} won by ${runs1 - runs2} runs`
              } else if (runs2 > runs1) {
                resultText = `${scorecard.team2} won by ${Math.max(0, 10 - (parseInt(scorecard.score2.split('/')[1], 10) || 0))} wickets`
              } else {
                resultText = 'Match tied!'
              }
              showAlert(`Match ended!\n${resultText}`, 'Match Completed')
              handleUpdateScorecard(booking.id, {
                ...updatedSc,
                result: resultText,
                isCompleted: true
              })
              setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, status: 'completed' } : b))
              setActiveScorecardBookingId(null)
            }
          }

          const recordBallOnState = (baseSc, type, runs = 0, isEditMode = false, oldLabel = '', allOutConfirmed = false, dismissalInfo = '') => {
            const scorecard = baseSc
            let newScore1 = scorecard.score1
            let newScore2 = scorecard.score2
            let currentInnings = scorecard.battingTeam

            // Parse current score: e.g. "45/2"
            let scoreStr = currentInnings === 1 ? newScore1 : newScore2
            let parts = scoreStr.split('/')
            let totalRuns = parseInt(parts[0], 10) || 0
            let totalWickets = parseInt(parts[1], 10) || 0

            // Parse overs: e.g. "5.4"
            let oversStr = currentInnings === 1 ? scorecard.overs1 : scorecard.overs2
            let overParts = oversStr.split('.')
            let completedOvers = parseInt(overParts[0], 10) || 0
            let ballsInOver = parseInt(overParts[1], 10) || 0

            let ballLabel = ''
            let strikerRunsInc = 0
            let strikerBallsInc = 0
            let bowlerBallsInc = 0
            let bowlerRunsInc = 0
            let bowlerWicketsInc = 0
            let isLegalBall = true

            if (type === 'run') {
              totalRuns += runs
              strikerRunsInc = runs
              strikerBallsInc = 1
              bowlerBallsInc = 1
              bowlerRunsInc = runs
              ballLabel = runs.toString()
            } else if (type === 'wide') {
              totalRuns += 1 + runs
              bowlerRunsInc = 1 + runs
              ballLabel = runs > 0 ? `Wd+${runs}` : 'Wd'
              isLegalBall = false
            } else if (type === 'no_ball') {
              totalRuns += 1 + runs
              strikerRunsInc = runs
              strikerBallsInc = 1
              bowlerRunsInc = 1 + runs
              ballLabel = runs > 0 ? `Nb+${runs}` : 'Nb'
              isLegalBall = false
            } else if (type === 'wicket') {
              totalWickets += 1
              strikerBallsInc = 1
              bowlerBallsInc = 1
              bowlerWicketsInc = 1
              ballLabel = 'W'
            } else if (type === 'runs_wicket') {
              totalRuns += runs
              totalWickets += 1
              strikerRunsInc = runs
              strikerBallsInc = 1
              bowlerBallsInc = 1
              bowlerRunsInc = runs
              ballLabel = `${runs}+W`
            }

            // Handle All Out check
            let allOutTriggered = false
            if (type === 'wicket' || type === 'runs_wicket') {
              const maxWickets = scorecard.singleBattingAllowed ? battingPlayersList.length : Math.max(1, battingPlayersList.length - 1)
              if (totalWickets >= maxWickets) {
                if (allOutConfirmed) {
                  allOutTriggered = true
                } else {
                  totalWickets -= 1
                  if (type === 'wicket') {
                    strikerBallsInc = 1
                    bowlerBallsInc = 1
                    bowlerWicketsInc = 0
                    ballLabel = '0'
                  } else {
                    bowlerWicketsInc = 0
                    ballLabel = runs.toString()
                  }
                }
              }
            }

            // Update overs and balls count
            if (isLegalBall) {
              ballsInOver += 1
              if (ballsInOver >= 6) {
                completedOvers += 1
                ballsInOver = 0
                showToast('Over completed! Change the bowler.', 'info')
              }
            }

            const updatedOvers = `${completedOvers}.${ballsInOver}`
            const updatedScore = `${totalRuns}/${totalWickets}`

            let newBallLabelVal = ballLabel
            if (isEditMode) {
              newBallLabelVal = { label: ballLabel, originalLabel: oldLabel, edited: true }
            }

            const newBallsThisOver = [...(scorecard.ballsThisOver || []), newBallLabelVal]

            // Swap batsmen if odd runs scored on a legal ball (or wide/no ball if applicable)
            let swap = false
            if (type === 'run' && runs % 2 !== 0) {
              swap = true
            }

            let tempStriker = swap ? scorecard.nonStriker : scorecard.striker
            let tempNonStriker = swap ? scorecard.striker : scorecard.nonStriker

            let nextStriker = tempStriker
            let nextNonStriker = tempNonStriker

            // Swap ends if over completed
            const isOverComplete = isLegalBall && ballsInOver === 0
            if (isOverComplete) {
              if (type === 'wicket' || type === 'runs_wicket') {
                nextStriker = tempNonStriker
                nextNonStriker = ''
              } else {
                nextStriker = tempNonStriker
                nextNonStriker = tempStriker
              }
            }

            // Accumulate detailed batsman/bowler stats
            const currentBattingStats = { ...(scorecard.battingStats || {}) }
            if (scorecard.striker) {
              const currentS = currentBattingStats[scorecard.striker] || { runs: 0, balls: 0, fours: 0, sixes: 0, out: false }
              let newFours = currentS.fours || 0
              let newSixes = currentS.sixes || 0
              if (type === 'run') {
                if (runs === 4) newFours++
                if (runs === 6) newSixes++
              }
              currentBattingStats[scorecard.striker] = {
                ...currentS,
                runs: currentS.runs + strikerRunsInc,
                balls: currentS.balls + strikerBallsInc,
                fours: newFours,
                sixes: newSixes,
                out: (type === 'wicket' || type === 'runs_wicket') ? true : currentS.out,
                dismissalInfo: (type === 'wicket' || type === 'runs_wicket') ? dismissalInfo : currentS.dismissalInfo
              }
            }
            if (scorecard.nonStriker && !currentBattingStats[scorecard.nonStriker]) {
              currentBattingStats[scorecard.nonStriker] = { runs: 0, balls: 0, fours: 0, sixes: 0, out: false }
            }

            const currentBowlingStats = { ...(scorecard.bowlingStats || {}) }
            if (scorecard.bowler) {
              const currentB = currentBowlingStats[scorecard.bowler] || { runs: 0, balls: 0, wickets: 0 }
              currentBowlingStats[scorecard.bowler] = {
                runs: currentB.runs + bowlerRunsInc,
                balls: currentB.balls + bowlerBallsInc,
                wickets: currentB.wickets + bowlerWicketsInc
              }
            }

            const currentExtras = { ...(scorecard.extras || { wides: 0, noBalls: 0 }) }
            if (type === 'wide') {
              currentExtras.wides = (currentExtras.wides || 0) + 1
            } else if (type === 'no_ball') {
              currentExtras.noBalls = (currentExtras.noBalls || 0) + 1
            }

            const resultState = {
              ...scorecard,
              score1: currentInnings === 1 ? updatedScore : scorecard.score1,
              overs1: currentInnings === 1 ? updatedOvers : scorecard.overs1,
              score2: currentInnings === 2 ? updatedScore : scorecard.score2,
              overs2: currentInnings === 2 ? updatedOvers : scorecard.overs2,
              striker: (type === 'wicket' && !isOverComplete) ? '' : nextStriker,
              nonStriker: nextNonStriker,
              strikerRuns: nextStriker ? (currentBattingStats[nextStriker]?.runs || 0) : 0,
              strikerBalls: nextStriker ? (currentBattingStats[nextStriker]?.balls || 0) : 0,
              nonStrikerRuns: nextNonStriker ? (currentBattingStats[nextNonStriker]?.runs || 0) : 0,
              nonStrikerBalls: nextNonStriker ? (currentBattingStats[nextNonStriker]?.balls || 0) : 0,
              bowlerRuns: scorecard.bowler ? currentBowlingStats[scorecard.bowler].runs : 0,
              bowlerBalls: scorecard.bowler ? currentBowlingStats[scorecard.bowler].balls : 0,
              bowlerWickets: scorecard.bowler ? currentBowlingStats[scorecard.bowler].wickets : 0,
              ballsThisOver: newBallsThisOver,
              battingStats: currentBattingStats,
              bowlingStats: currentBowlingStats,
              extras: currentExtras,
              result: `In progress: ${currentInnings === 1 ? (scorecard.team1 || 'Team A') : (scorecard.team2 || 'Team B')} batting`
            }

            if (allOutTriggered) {
              resultState._allOutTriggered = true
            }
            if (scorecard.matchOvers && completedOvers >= scorecard.matchOvers) {
              resultState._oversCompleted = true
            }

            return resultState
          }

          const handleRecordBall = async (type, runs = 0) => {
            const scorecard = booking.scoreCard
            if (!scorecard) return

            let allOutConfirmed = false
            if (type === 'wicket' || type === 'runs_wicket') {
              const runsWicketsStr = scorecard.battingTeam === 1 ? scorecard.score1 : scorecard.score2
              const wicketsCount = parseInt(runsWicketsStr.split('/')[1], 10) || 0
              
              const maxWickets = scorecard.singleBattingAllowed ? battingPlayersList.length : Math.max(1, battingPlayersList.length - 1)
              if (wicketsCount + 1 >= maxWickets) {
                allOutConfirmed = await showConfirm("All wickets have fallen. Is the team indeed all out?", "Confirm All Out")
              }
            }

            let dismissalInfoStr = ''
            if (type === 'wicket' || type === 'runs_wicket') {
              const dismissalType = await showSelectPrompt(
                "How did the batsman get out?",
                ['Catch', 'Bowled', 'Run Out', 'Stumped', 'LBW', 'Hit Wicket', 'Retired'],
                'Catch',
                "Dismissal Info"
              )
              dismissalInfoStr = dismissalType || "Out"
            }

            const scCopy = deepCopyScorecard(scorecard)
            const newUndoStack = [...(scorecard.undoStack || []), scCopy].slice(-15)

            const nextScState = recordBallOnState(scorecard, type, runs, false, '', allOutConfirmed, dismissalInfoStr)
            nextScState.undoStack = newUndoStack

            if (nextScState._allOutTriggered) {
              delete nextScState._allOutTriggered
              triggerDeclareInnings(nextScState)
            } else if (nextScState._oversCompleted) {
              delete nextScState._oversCompleted
              triggerDeclareInnings(nextScState)
            } else {
              const legalCount = nextScState.ballsThisOver?.filter(b => {
                const label = typeof b === 'object' && b !== null ? b.label : b
                return !['Wd', 'Nb'].some(ext => typeof label === 'string' && label.includes(ext))
              }).length || 0

              if (legalCount >= 6) {
                const runsThisOver = nextScState.ballsThisOver?.reduce((sum, b) => {
                  const label = typeof b === 'object' && b !== null ? b.label : b
                  if (typeof label === 'string' && label.includes('Wd')) return sum + 1 + (parseInt(label.split('+')[1]) || 0)
                  if (typeof label === 'string' && label.includes('Nb')) return sum + 1 + (parseInt(label.split('+')[1]) || 0)
                  return sum + (parseInt(label) || 0)
                }, 0)
                
                if (runsThisOver === 0 && nextScState.bowler) {
                   const stats = nextScState.bowlingStats[nextScState.bowler] || { runs: 0, balls: 0, wickets: 0, maidens: 0 }
                   stats.maidens = (stats.maidens || 0) + 1
                   nextScState.bowlingStats[nextScState.bowler] = stats
                }
                
                nextScState.lastBowler = nextScState._retiredBowlerThisOver ? `${nextScState._retiredBowlerThisOver},${nextScState.bowler}` : nextScState.bowler
                delete nextScState._retiredBowlerThisOver
                nextScState.bowler = null
              }
              handleUpdateScorecard(booking.id, nextScState)
            }

            if (type === 'wicket' || type === 'runs_wicket') {
              if (!nextScState.striker) {
                setBatsmanStriker('')
              }
              if (!nextScState.nonStriker) {
                setBatsmanNonStriker('')
              }
            }
          }

          const handleChooseNewStriker = (name) => {
            setBatsmanStriker(name)
            const scorecard = booking.scoreCard
            const currentBattingStats = { ...(scorecard.battingStats || {}) }
            const existingStats = currentBattingStats[name] || { runs: 0, balls: 0, out: false }
            
            if (existingStats.retired) {
              existingStats.retired = false
            }
            currentBattingStats[name] = existingStats

            handleUpdateScorecard(booking.id, {
              striker: name,
              strikerRuns: existingStats.runs || 0,
              strikerBalls: existingStats.balls || 0,
              battingStats: currentBattingStats
            })
          }

          const handleChooseNewNonStriker = (name) => {
            setBatsmanNonStriker(name)
            const scorecard = booking.scoreCard
            const currentBattingStats = { ...(scorecard.battingStats || {}) }
            const existingStats = currentBattingStats[name] || { runs: 0, balls: 0, out: false }
            
            if (existingStats.retired) {
              existingStats.retired = false
            }
            currentBattingStats[name] = existingStats

            handleUpdateScorecard(booking.id, {
              nonStriker: name,
              nonStrikerRuns: existingStats.runs || 0,
              nonStrikerBalls: existingStats.balls || 0,
              battingStats: currentBattingStats
            })
          }

          const handleChooseNewBowler = (name) => {
            const scorecard = booking.scoreCard
            const currentBowlingStats = { ...(scorecard.bowlingStats || {}) }
            if (!currentBowlingStats[name]) {
              currentBowlingStats[name] = { runs: 0, balls: 0, wickets: 0, maidens: 0 }
            }
            handleUpdateScorecard(booking.id, {
              bowler: name,
              bowlerBalls: 0,
              bowlerRuns: 0,
              bowlerWickets: 0,
              ballsThisOver: [],
              bowlingStats: currentBowlingStats
            })
          }

          const handleOverCompleteReset = () => {
            const scorecard = booking.scoreCard
            handleUpdateScorecard(booking.id, {
              lastBowler: scorecard.bowler,
              ballsThisOver: [],
              bowler: '',
              bowlerBalls: 0,
              bowlerRuns: 0,
              bowlerWickets: 0
            })
            setCurrentBowler('')
          }

          const handleDeclareInnings = () => {
            const scorecard = booking.scoreCard
            triggerDeclareInnings(scorecard)
          }

          const handleRetiredHurt = () => {
            const scorecard = booking.scoreCard
            if (!scorecard || !scorecard.striker) return
            
            const currentBattingStats = { ...(scorecard.battingStats || {}) }
            const strikerStats = currentBattingStats[scorecard.striker] || { runs: 0, balls: 0, out: false }
            
            currentBattingStats[scorecard.striker] = {
              ...strikerStats,
              retired: true,
              out: false
            }

            const scCopy = deepCopyScorecard(scorecard)
            const newUndoStack = [...(scorecard.undoStack || []), scCopy].slice(-15)

            handleUpdateScorecard(booking.id, {
              striker: '',
              strikerRuns: 0,
              strikerBalls: 0,
              battingStats: currentBattingStats,
              undoStack: newUndoStack
            })
            
            setBatsmanStriker('')
          }

          const handleNonStrikerRetiredHurt = () => {
            const scorecard = booking.scoreCard
            if (!scorecard || !scorecard.nonStriker) return
            
            const currentBattingStats = { ...(scorecard.battingStats || {}) }
            const nonStrikerStats = currentBattingStats[scorecard.nonStriker] || { runs: 0, balls: 0, out: false }
            
            currentBattingStats[scorecard.nonStriker] = {
              ...nonStrikerStats,
              retired: true,
              out: false
            }

            const scCopy = deepCopyScorecard(scorecard)
            const newUndoStack = [...(scorecard.undoStack || []), scCopy].slice(-15)

            handleUpdateScorecard(booking.id, {
              nonStriker: '',
              nonStrikerRuns: 0,
              nonStrikerBalls: 0,
              battingStats: currentBattingStats,
              undoStack: newUndoStack
            })
            
            setBatsmanNonStriker('')
          }

          const handleBowlerRetiredHurt = () => {
            const scorecard = booking.scoreCard
            if (!scorecard || !scorecard.bowler) return
            
            const currentBowlingStats = { ...(scorecard.bowlingStats || {}) }
            const bowlerStats = currentBowlingStats[scorecard.bowler] || { runs: 0, balls: 0, wickets: 0 }
            
            currentBowlingStats[scorecard.bowler] = {
              ...bowlerStats,
              retired: true
            }

            const scCopy = deepCopyScorecard(scorecard)
            const newUndoStack = [...(scorecard.undoStack || []), scCopy].slice(-15)

            handleUpdateScorecard(booking.id, {
              _retiredBowlerThisOver: scorecard.bowler,
              bowler: null,
              bowlerBalls: 0,
              bowlerRuns: 0,
              bowlerWickets: 0,
              bowlingStats: currentBowlingStats,
              undoStack: newUndoStack
            })
          }

          const handleUndoLastBall = () => {
            const scorecard = booking.scoreCard
            if (!scorecard || !scorecard.undoStack || scorecard.undoStack.length === 0) {
              showToast("No balls to undo!", "error")
              return
            }
            
            const newUndoStack = [...scorecard.undoStack]
            const prevState = newUndoStack.pop()

            handleUpdateScorecard(booking.id, {
              ...prevState,
              undoStack: newUndoStack
            })

            if (prevState.striker) setBatsmanStriker(prevState.striker)
            else setBatsmanStriker('')
            
            if (prevState.nonStriker) setBatsmanNonStriker(prevState.nonStriker)
            else setBatsmanNonStriker('')
            
            if (prevState.bowler) setCurrentBowler(prevState.bowler)
            else setCurrentBowler('')
          }

          const handleEditLastBall = async () => {
            const scorecard = booking.scoreCard
            if (!scorecard || !scorecard.ballsThisOver || scorecard.ballsThisOver.length === 0) {
              showToast("No balls in this over to edit!", "error")
              return
            }

            if (!scorecard.undoStack || scorecard.undoStack.length === 0) {
              showToast("No undo history available to edit the last ball!", "error")
              return
            }

            const lastBallVal = scorecard.ballsThisOver[scorecard.ballsThisOver.length - 1]
            const oldLabel = (typeof lastBallVal === 'object') ? lastBallVal.label : lastBallVal

            const choicesStr = "Enter new outcome:\n0, 1, 2, 3, 4, 6\nwd (Wide)\nnb (No Ball)\nw (Wicket)\nwd+runs (Wide + runs)\nnb+runs (No Ball + runs)\nruns+w (Runs + wicket)"
            const input = await showPrompt(choicesStr, oldLabel, "outcome (e.g. 1, wd, nb, w, wd+1)", "Edit Ball Outcome")
            if (input === null) return

            let type = 'run'
            let runs = 0
            const normalizedInput = input.trim().toLowerCase()

            if (['0', '1', '2', '3', '4', '6'].includes(normalizedInput)) {
              type = 'run'
              runs = parseInt(normalizedInput, 10)
            } else if (normalizedInput === 'wd') {
              type = 'wide'
              runs = 0
            } else if (normalizedInput === 'nb') {
              type = 'no_ball'
              runs = 0
            } else if (normalizedInput === 'w') {
              type = 'wicket'
            } else if (normalizedInput === 'wd+runs' || normalizedInput.startsWith('wd+')) {
              const defaultVal = normalizedInput.includes('+') ? normalizedInput.split('+')[1] : "1"
              const val = await showPrompt("Enter runs ran on wide ball:", defaultVal, "Extra runs")
              if (val === null) return
              const extraRuns = parseInt(val, 10) || 1
              type = 'wide'
              runs = extraRuns
            } else if (normalizedInput === 'nb+runs' || normalizedInput.startsWith('nb+')) {
              const defaultVal = normalizedInput.includes('+') ? normalizedInput.split('+')[1] : "1"
              const val = await showPrompt("Enter runs ran on no ball:", defaultVal, "Extra runs")
              if (val === null) return
              const extraRuns = parseInt(val, 10) || 1
              type = 'no_ball'
              runs = extraRuns
            } else if (normalizedInput === 'runs+w' || normalizedInput.endsWith('+w') || normalizedInput.endsWith('+wicket')) {
              const defaultVal = normalizedInput.includes('+') ? normalizedInput.split('+')[0] : "1"
              const val = await showPrompt("Enter runs completed before run-out wicket:", defaultVal, "Runs completed")
              if (val === null) return
              const runsRan = parseInt(val, 10) || 1
              type = 'runs_wicket'
              runs = runsRan
            } else {
              showToast("Invalid input! Ball not edited.", "error")
              return
            }

            const newUndoStack = [...scorecard.undoStack]
            const prevState = newUndoStack.pop()

            let allOutConfirmed = false
            if (type === 'wicket' || type === 'runs_wicket') {
              const runsWicketsStr = prevState.battingTeam === 1 ? prevState.score1 : prevState.score2
              const wicketsCount = parseInt(runsWicketsStr.split('/')[1], 10) || 0
              
              const maxWickets = prevState.singleBattingAllowed ? battingPlayersList.length : Math.max(1, battingPlayersList.length - 1)
              if (wicketsCount + 1 >= maxWickets) {
                allOutConfirmed = await showConfirm("All wickets have fallen. Is the team indeed all out?", "Confirm All Out")
              }
            }

            const nextScState = recordBallOnState(prevState, type, runs, true, oldLabel, allOutConfirmed)
            nextScState.undoStack = newUndoStack

            if (nextScState._allOutTriggered) {
              delete nextScState._allOutTriggered
              triggerDeclareInnings(nextScState)
            } else {
              handleUpdateScorecard(booking.id, nextScState)
            }

            if (nextScState.striker) setBatsmanStriker(nextScState.striker)
            else setBatsmanStriker('')
            
            if (nextScState.nonStriker) setBatsmanNonStriker(nextScState.nonStriker)
            else setBatsmanNonStriker('')
            
            if (nextScState.bowler) setCurrentBowler(nextScState.bowler)
            else setCurrentBowler('')
          }

          // Team Roster filtered lists
          const teamAPlayers = booking.matchPlayers?.filter(p => p.team === 1) || []
          const teamBPlayers = booking.matchPlayers?.filter(p => p.team === 2) || []
          const unassignedPlayers = booking.matchPlayers?.filter(p => !p.team) || []

          const battingTeamNum = booking.scoreCard?.battingTeam || 1
          const battingPlayersList = battingTeamNum === 1 ? teamAPlayers : teamBPlayers
          const bowlingPlayersList = battingTeamNum === 1 ? teamBPlayers : teamAPlayers

          return (
            <div className="scorecard-modal-overlay">
              <div className="scorecard-modal-card">
                
                 {/* Modal Header */}
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glow)', paddingBottom: '16px', marginBottom: '24px' }}>
                   <div>
                     <h2 style={{ fontSize: '22px', fontWeight: '900', color: booking.sportId === 'football' ? 'var(--accent-football)' : 'var(--accent-cricket)' }}>
                       {booking.sportId === 'football' ? 'Football Live Scorecard Manager' : 'Cricket Live Scorecard Manager'}
                     </h2>
                     <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Match ID: {booking.id} • Turf {booking.turfId}</span>
                   </div>
                   <button 
                     className="btn-login" 
                     style={{ borderColor: booking.sportId === 'football' ? 'var(--accent-football)' : 'var(--accent-cricket)', color: booking.sportId === 'football' ? 'var(--accent-football)' : 'var(--accent-cricket)', padding: '6px 16px' }}
                     onClick={() => setActiveScorecardBookingId(null)}
                   >
                     Close & Exit
                   </button>
                 </div>

                {/* STEP 1: NEW SPLIT TEAM SETUP SCREEN */}
                {scorecardStep === 'new_splitter' && (
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: 'var(--accent-football)' }}>
                      Step 1: Roster Selection & Team Splitting
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                      Select who is playing today from your booking roster, add additional players if needed, then split them into two teams.
                    </p>

                    <div className="roster-select-grid" style={{ background: 'var(--bg-dark)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-glow)' }}>
                      {/* Left: Player Selection Roster */}
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px', color: 'var(--text-main)' }}>
                          Select Playing Roster ({activePlayingNames.length} selected)
                        </h4>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto', paddingRight: '8px', marginBottom: '16px' }}>
                          {booking.matchPlayers && booking.matchPlayers.map(p => {
                            const isChecked = activePlayingNames.includes(p.name);
                            return (
                              <div 
                                key={p.name} 
                                style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'space-between', 
                                  background: isChecked ? 'rgba(0, 255, 102, 0.04)' : 'rgba(255,255,255,0.01)',
                                  border: `1px solid ${isChecked ? 'rgba(0, 255, 102, 0.2)' : 'var(--border-glow)'}`,
                                  padding: '10px 14px',
                                  borderRadius: '8px',
                                  transition: 'var(--transition-smooth)'
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <input 
                                    type="checkbox" 
                                    checked={isChecked}
                                    onChange={() => {
                                      if (isChecked) {
                                        setActivePlayingNames(prev => prev.filter(n => n !== p.name));
                                      } else {
                                        setActivePlayingNames(prev => [...prev, p.name]);
                                      }
                                    }}
                                    style={{ cursor: 'pointer', accentColor: 'var(--accent-football)' }}
                                  />
                                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: isChecked ? 'var(--text-main)' : 'var(--text-muted)' }}>
                                    {p.name}
                                  </span>
                                </div>
                                <span style={{ fontSize: '10px', textTransform: 'uppercase', padding: '2px 6px', borderRadius: '4px', background: p.isShadow ? 'var(--bg-card-hover)' : 'rgba(0,150,255,0.1)', color: p.isShadow ? 'var(--text-muted)' : '#00bfff' }}>
                                  {p.isShadow ? 'Shadow' : 'Player'}
                                </span>
                              </div>
                            );
                          })}
                          {(!booking.matchPlayers || booking.matchPlayers.length === 0) && (
                            <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '12px' }}>Roster is empty. Add players below.</div>
                          )}
                        </div>

                        {/* Add More Players Bar */}
                        <div style={{ borderTop: '1px solid var(--border-glow)', paddingTop: '16px' }}>
                          <h5 style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-muted)' }}>Add New/Shadow Players:</h5>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <input 
                              type="text" 
                              placeholder="Type player name..." 
                              className="login-input" 
                              value={newMatchPlayerName}
                              onChange={(e) => setNewMatchPlayerName(e.target.value)}
                              style={{ flex: 1, margin: 0, height: '36px', padding: '8px 12px', borderRadius: '8px', fontSize: '12px' }}
                            />
                            <button 
                              className="btn-login"
                              style={{ padding: '0 16px', height: '36px', borderRadius: '8px', fontSize: '12px', margin: 0, borderColor: 'var(--accent-football)', color: 'var(--accent-football)' }}
                              onClick={(e) => {
                                e.preventDefault();
                                if (!newMatchPlayerName.trim()) return;
                                const nameExists = booking.matchPlayers && booking.matchPlayers.some(p => p.name.toLowerCase() === newMatchPlayerName.trim().toLowerCase());
                                if (nameExists) {
                                  showToast('A player with this name is already in the roster.', 'error');
                                  return;
                                }
                                const newPlayerObj = { name: newMatchPlayerName.trim(), email: null, isShadow: true, team: null };
                                setBookings(prev => prev.map(b => {
                                  if (b.id === booking.id) {
                                    return {
                                      ...b,
                                      matchPlayers: [...(b.matchPlayers || []), newPlayerObj]
                                    }
                                  }
                                  return b;
                                }));
                                setActivePlayingNames(prev => [...prev, newPlayerObj.name]);
                                setNewMatchPlayerName('');
                              }}
                            >
                              + Add
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Right: Quick Search and Add existing Shadow Profiles */}
                      <div className="roster-select-right">
                        <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px', color: 'var(--text-main)' }}>
                          Add Existing Profiles
                        </h4>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                          Quickly add offline shadow players from your contacts database.
                        </p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto', background: 'rgba(0,0,0,0.1)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-glow)' }}>
                          {profiles
                            .filter(p => !booking.matchPlayers?.some(bp => bp.name === p.name))
                            .map(p => (
                              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', padding: '6px 8px', background: 'rgba(255,255,255,0.01)', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                <span>{p.name}</span>
                                <button 
                                  className="role-selector" 
                                  style={{ padding: '2px 8px', fontSize: '10px', borderRadius: '4px' }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    const newPlayerObj = { name: p.name, email: p.email || null, isShadow: p.isShadow, team: null };
                                    setBookings(prev => prev.map(b => {
                                      if (b.id === booking.id) {
                                        return {
                                          ...b,
                                          matchPlayers: [...(b.matchPlayers || []), newPlayerObj]
                                        }
                                      }
                                      return b;
                                    }));
                                    setActivePlayingNames(prev => [...prev, newPlayerObj.name]);
                                  }}
                                >
                                  + Add
                                </button>
                              </div>
                            ))
                          }
                          {profiles.filter(p => !booking.matchPlayers?.some(bp => bp.name === p.name)).length === 0 && (
                            <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '11px', textAlign: 'center', padding: '8px' }}>
                              All available profiles are already in this match.
                            </div>
                          )}
                        </div>

                        {/* Split Action */}
                        <div style={{ marginTop: '24px', textAlign: 'center' }}>
                          <button
                            className="btn-book-action"
                            style={{ 
                              background: 'linear-gradient(135deg, var(--accent-football) 0%, #00bfff 100%)', 
                              boxShadow: '0 4px 15px rgba(0, 255, 102, 0.25)',
                              color: '#000',
                              fontWeight: '900'
                            }}
                            disabled={activePlayingNames.length < 2}
                            onClick={(e) => {
                              e.preventDefault();
                              const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);
                              const playingNames = booking.matchPlayers.filter(p => activePlayingNames.includes(p.name)).map(p => p.name);
                              const shuffled = shuffleArray(playingNames);
                              const mid = Math.ceil(shuffled.length / 2);
                              
                              const updatedMatchPlayers = booking.matchPlayers.map(p => {
                                if (!activePlayingNames.includes(p.name)) {
                                  return { ...p, team: null };
                                }
                                const idx = shuffled.indexOf(p.name);
                                return { ...p, team: idx < mid ? 1 : 2 };
                              });

                              setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, matchPlayers: updatedMatchPlayers } : b));

                              if (isSupabaseConfigured) {
                                const syncSplit = async () => {
                                  try {
                                    await supabase
                                      .from('match_players')
                                      .delete()
                                      .eq('booking_id', booking.id);

                                    const rosterToInsert = [];
                                    for (const p of updatedMatchPlayers) {
                                      if (p.team) {
                                        const prof = profiles.find(pr => pr.name === p.name);
                                        if (prof && prof.id && prof.id.length > 8) {
                                          rosterToInsert.push({
                                            booking_id: booking.id,
                                            profile_id: prof.id,
                                            team_number: p.team
                                          });
                                        }
                                      }
                                    }

                                    if (rosterToInsert.length > 0) {
                                      await supabase
                                        .from('match_players')
                                        .insert(rosterToInsert);
                                    }
                                  } catch (err) {
                                    console.error('Error syncing match players to Supabase:', err);
                                  }
                                };
                                syncSplit();
                              }

                              showToast('Teams Split Successfully!', 'success');
                            }}
                          >
                            ⚡ Auto-Split Teams
                          </button>
                          {activePlayingNames.length < 2 && (
                            <div style={{ color: 'var(--accent-cricket)', fontSize: '10px', marginTop: '6px' }}>
                              * Select at least 2 players to split teams.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Display Split Teams */}
                    <div className="roster-select-grid" style={{ marginTop: '20px' }}>
                      <div style={{ background: 'rgba(0, 255, 102, 0.02)', border: '1px solid rgba(0, 255, 102, 0.15)', padding: '16px', borderRadius: '12px' }}>
                        <h4 style={{ fontSize: '13px', color: 'var(--accent-football)', fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid rgba(0,255,102,0.15)', paddingBottom: '4px' }}>
                          Team A ({booking.matchPlayers?.filter(p => p.team === 1).length || 0})
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {booking.matchPlayers?.filter(p => p.team === 1).map(p => (
                            <div key={p.name} style={{ fontSize: '12px', textAlign: 'left' }}>• {p.name}</div>
                          ))}
                        </div>
                      </div>

                      <div style={{ background: 'rgba(255, 71, 71, 0.02)', border: '1px solid rgba(255, 71, 71, 0.15)', padding: '16px', borderRadius: '12px' }}>
                        <h4 style={{ fontSize: '13px', color: 'var(--accent-cricket)', fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid rgba(255,71,71,0.15)', paddingBottom: '4px' }}>
                          Team B ({booking.matchPlayers?.filter(p => p.team === 2).length || 0})
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {booking.matchPlayers?.filter(p => p.team === 2).map(p => (
                            <div key={p.name} style={{ fontSize: '12px', textAlign: 'left' }}>• {p.name}</div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <button 
                        className="btn-login"
                        style={{ margin: 0 }}
                        onClick={() => setScorecardStep('splitter')}
                      >
                        Manual Drag & Drop Mode
                      </button>
                      {booking.sportId === 'football' ? (
                        <button 
                          className="btn-book-action"
                          style={{ width: 'auto', padding: '12px 30px' }}
                          disabled={!booking.matchPlayers?.some(p => p.team === 1) || !booking.matchPlayers?.some(p => p.team === 2)}
                          onClick={handleConfirmFootballRoster}
                        >
                          Confirm Roster & Start Match ⚽
                        </button>
                      ) : (
                        <button 
                          className="btn-book-action"
                          style={{ width: 'auto', padding: '12px 30px' }}
                          disabled={!booking.matchPlayers?.some(p => p.team === 1) || !booking.matchPlayers?.some(p => p.team === 2)}
                          onClick={handleStartToss}
                        >
                          Confirm Roster & Proceed to Toss 🪙
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* OLD STEP 1: TEAM SPLITTER (DRAG & DROP FALLBACK) */}
                {scorecardStep === 'splitter' && (
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Manual Split Match Roster into Team A & Team B</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                      Drag and drop players from the unassigned roster into Team A (Batting/Bowling) or Team B. 
                      You can also click the quick buttons next to each player.
                    </p>

                    {/* Drag and Drop Grid */}
                    <div className="drag-splitter-grid">
                      
                      {/* Unassigned column */}
                      <div 
                        className="drag-column" 
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, null)}
                      >
                        <div className="drag-column-title">
                          <span>Unassigned ({unassignedPlayers.length})</span>
                        </div>
                        {unassignedPlayers.map(p => (
                          <div 
                            key={p.name} 
                            className="drag-item"
                            draggable
                            onDragStart={(e) => handleDragStart(e, p.name)}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span>{p.name}</span>
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <button style={{ background: 'rgba(0, 255, 102, 0.1)', border: 'none', color: 'var(--accent-football)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer' }} onClick={() => handleAssignMatchPlayerTeam(booking.id, p.name, 1)}>+ A</button>
                                <button style={{ background: 'rgba(255, 71, 71, 0.1)', border: 'none', color: 'var(--accent-cricket)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer' }} onClick={() => handleAssignMatchPlayerTeam(booking.id, p.name, 2)}>+ B</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Team A column */}
                      <div 
                        className="drag-column" 
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, 1)}
                        style={{ borderColor: 'rgba(0, 255, 102, 0.2)' }}
                      >
                        <div className="drag-column-title" style={{ color: 'var(--accent-football)' }}>
                          <span>Team A ({teamAPlayers.length})</span>
                        </div>
                        {teamAPlayers.map(p => (
                          <div 
                            key={p.name} 
                            className="drag-item"
                            draggable
                            onDragStart={(e) => handleDragStart(e, p.name)}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span>{p.name}</span>
                              <button style={{ background: 'var(--bg-card-hover)', border: 'none', color: 'var(--text-muted)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer' }} onClick={() => handleAssignMatchPlayerTeam(booking.id, p.name, null)}>Remove</button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Team B column */}
                      <div 
                        className="drag-column" 
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, 2)}
                        style={{ borderColor: 'rgba(255, 71, 71, 0.2)' }}
                      >
                        <div className="drag-column-title" style={{ color: 'var(--accent-cricket)' }}>
                          <span>Team B ({teamBPlayers.length})</span>
                        </div>
                        {teamBPlayers.map(p => (
                          <div 
                            key={p.name} 
                            className="drag-item"
                            draggable
                            onDragStart={(e) => handleDragStart(e, p.name)}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span>{p.name}</span>
                              <button style={{ background: 'var(--bg-card-hover)', border: 'none', color: 'var(--text-muted)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer' }} onClick={() => handleAssignMatchPlayerTeam(booking.id, p.name, null)}>Remove</button>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>

                    <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
                      <button 
                        className="btn-login"
                        style={{ margin: 0 }}
                        onClick={() => setScorecardStep('new_splitter')}
                      >
                        Back to Selection
                      </button>
                      {booking.sportId === 'football' ? (
                        <button 
                          className="btn-book-action"
                          style={{ width: 'auto', padding: '12px 30px' }}
                          disabled={teamAPlayers.length === 0 || teamBPlayers.length === 0}
                          onClick={handleConfirmFootballRoster}
                        >
                          Confirm Roster & Start Match ⚽
                        </button>
                      ) : (
                        <button 
                          className="btn-book-action"
                          style={{ width: 'auto', padding: '12px 30px' }}
                          disabled={teamAPlayers.length === 0 || teamBPlayers.length === 0}
                          onClick={handleStartToss}
                        >
                          Confirm Roster & Proceed to Toss
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 2: COIN TOSS SCREEN */}
                {scorecardStep === 'toss' && (
                  <div style={{ textAlign: 'left' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: 'var(--accent-cricket)' }}>
                      Step 2: Toss details & Match Settings
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                      Enter the details of the toss winner, choice, match overs, and single-batting rules.
                    </p>

                    <div style={{ background: 'var(--bg-dark)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-glow)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glow)', paddingBottom: '16px' }}>
                        <div>
                          <span style={{ fontSize: '13px', fontWeight: 'bold' }}>Need a coin flip?</span>
                          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Simulate a virtual coin toss</p>
                        </div>
                        <button 
                          className="btn-login" 
                          style={{ margin: 0, padding: '8px 20px', fontSize: '12px' }}
                          onClick={(e) => {
                            e.preventDefault();
                            handleCoinFlip();
                            showToast("Flipping coin! Outcome will be applied automatically below.", "info");
                          }}
                          disabled={tossCoinState.spinning}
                        >
                          {tossCoinState.spinning ? 'Flipping...' : '🪙 Flip Coin'}
                        </button>
                      </div>

                      <div className="active-players-setup-grid">
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                            Who won the Toss?
                          </label>
                          <select 
                            className="role-selector" 
                            style={{ width: '100%', padding: '10px' }}
                            value={tossWinnerOverride}
                            onChange={(e) => setTossWinnerOverride(parseInt(e.target.value, 10))}
                          >
                            <option value={1}>Team A ({booking.teamName || 'Team A'})</option>
                            <option value={2}>Team B (Opponent Team)</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                            Decision
                          </label>
                          <select 
                            className="role-selector" 
                            style={{ width: '100%', padding: '10px' }}
                            value={tossChoiceOverride}
                            onChange={(e) => setTossChoiceOverride(e.target.value)}
                          >
                            <option value="Batting">Choose to Bat</option>
                            <option value="Bowling">Choose to Bowl</option>
                          </select>
                        </div>
                      </div>

                      <div className="active-players-setup-grid" style={{ marginTop: '10px' }}>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                            How many Overs match?
                          </label>
                          <input 
                            type="number" 
                            min="1"
                            max="50"
                            className="role-selector" 
                            style={{ width: '100%', padding: '10px', borderRadius: '8px' }}
                            value={matchOversInput}
                            onChange={(e) => setMatchOversInput(Math.max(1, parseInt(e.target.value, 10) || 1))}
                          />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <span style={{ fontSize: '13px', fontWeight: 'bold' }}>Single Batting Allowed</span>
                          <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>If enabled, the last batsman can bat alone without a partner</p>
                          <label className="toggle-switch" style={{ marginTop: '8px' }}>
                            <input 
                              type="checkbox" 
                              checked={singleBattingInput}
                              onChange={(e) => setSingleBattingInput(e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </div>
                      </div>

                      <button 
                        className="btn-book-action" 
                        style={{ width: '100%', marginTop: '16px' }}
                        onClick={(e) => {
                          e.preventDefault();
                          handleAcceptToss();
                        }}
                      >
                        Accept Toss & Proceed to Player Setup 🏏
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: SETUP ACTIVE PLAYERS */}
                {scorecardStep === 'setup' && (
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Step 3: Setup Active Batsmen & Bowler</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                      Select the opening batsmen (Striker and Non-Striker) from the Batting team, and the opening bowler from the Bowling team.
                    </p>

                    {/* Teams roster preview */}
                    <div className="roster-select-grid" style={{ marginBottom: '20px' }}>
                      <div style={{ background: 'rgba(0, 255, 102, 0.02)', border: '1px solid rgba(0, 255, 102, 0.15)', padding: '12px', borderRadius: '10px' }}>
                        <h4 style={{ fontSize: '13px', color: 'var(--accent-football)', fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid rgba(0,255,102,0.15)', paddingBottom: '4px' }}>
                          Team A ({teamAPlayers.length})
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {teamAPlayers.map(p => (
                            <div key={p.name} style={{ fontSize: '12px', textAlign: 'left' }}>• {p.name}</div>
                          ))}
                        </div>
                      </div>

                      <div style={{ background: 'rgba(255, 71, 71, 0.02)', border: '1px solid rgba(255, 71, 71, 0.15)', padding: '12px', borderRadius: '10px' }}>
                        <h4 style={{ fontSize: '13px', color: 'var(--accent-cricket)', fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid rgba(255,71,71,0.15)', paddingBottom: '4px' }}>
                          Team B ({teamBPlayers.length})
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {teamBPlayers.map(p => (
                            <div key={p.name} style={{ fontSize: '12px', textAlign: 'left' }}>• {p.name}</div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleSetupPlayers} style={{ background: 'var(--bg-dark)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-glow)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div className="active-players-setup-grid">
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                            Opening Striker (Batting Team)
                          </label>
                          <select 
                            className="role-selector" 
                            style={{ width: '100%', padding: '10px' }} 
                            value={batsmanStriker} 
                            onChange={(e) => setBatsmanStriker(e.target.value)}
                            required
                          >
                            <option value="" disabled>Select batsman...</option>
                            {getAvailableBatsmen(batsmanNonStriker)
                              .map(p => (
                                <option key={p.name} value={p.name}>{p.name}</option>
                              ))
                            }
                          </select>
                        </div>

                        <div>
                          <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                            Opening Non-Striker (Batting Team)
                          </label>
                          <select 
                            className="role-selector" 
                            style={{ width: '100%', padding: '10px' }} 
                            value={batsmanNonStriker} 
                            onChange={(e) => setBatsmanNonStriker(e.target.value)}
                            required
                          >
                            <option value="" disabled>Select batsman...</option>
                            {getAvailableBatsmen(batsmanStriker)
                              .map(p => (
                                <option key={p.name} value={p.name}>{p.name}</option>
                              ))
                            }
                          </select>
                        </div>
                      </div>

                      <div style={{ maxWidth: '400px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                          Active Bowler (Bowling Team)
                        </label>
                        <select 
                          className="role-selector" 
                          value={currentBowler} 
                          onChange={(e) => setCurrentBowler(e.target.value)}
                          required
                        >
                          <option value="" disabled>Select bowler...</option>
                          {bowlingPlayersList.map(p => (
                            <option key={p.name} value={p.name}>{p.name}</option>
                          ))}
                        </select>
                      </div>

                      <button 
                        type="submit" 
                        className="btn-book-action" 
                        style={{ marginTop: '12px' }}
                      >
                        Start Scoring Live Match
                      </button>
                    </form>
                  </div>
                )}

                {/* STEP 4: BALL-BY-BALL SCORING PANEL */}
                {scorecardStep === 'scoring' && (() => {
                  const sc = booking.scoreCard

                  if (booking.sportId === 'football') {
                    const score1 = sc.score1 || 0
                    const score2 = sc.score2 || 0
                    const team1Name = sc.team1 || booking.teamName || 'Team A'
                    const team2Name = sc.team2 || 'Opponent Team'

                    return (
                      <div>
                        {/* Football Live Dashboard */}
                        <div className="innings-dashboard-grid" style={{ background: 'var(--bg-dark)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-glow)', marginBottom: '24px', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', textAlign: 'center' }}>
                          <div>
                            <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold', color: 'var(--accent-football)' }}>Team A</span>
                            <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-main)', marginTop: '4px' }}>{team1Name}</h2>
                          </div>
                          
                          <div style={{ padding: '0 32px' }}>
                            <span style={{ fontSize: '48px', fontWeight: '900', color: 'var(--accent-football)', fontFamily: 'monospace' }}>
                              {score1} - {score2}
                            </span>
                            <div style={{ fontSize: '12px', color: 'orange', fontWeight: 'bold', marginTop: '4px' }}>⚡ LIVE FOOTBALL</div>
                          </div>

                          <div>
                            <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold', color: 'var(--accent-cricket)' }}>Team B</span>
                            <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-main)', marginTop: '4px' }}>{team2Name}</h2>
                          </div>
                        </div>

                        {/* Goal Scorer buttons */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                          <button 
                            className="btn-book-action" 
                            style={{ padding: '16px', background: 'rgba(0, 255, 102, 0.1)', border: '1px solid var(--accent-football)', color: 'var(--text-main)', fontWeight: 'bold' }}
                            onClick={() => handleAddFootballGoal(1)}
                          >
                            ⚽ Goal for {team1Name}
                          </button>
                          <button 
                            className="btn-book-action" 
                            style={{ padding: '16px', background: 'rgba(255, 71, 71, 0.1)', border: '1px solid var(--accent-cricket)', color: 'var(--text-main)', fontWeight: 'bold' }}
                            onClick={() => handleAddFootballGoal(2)}
                          >
                            ⚽ Goal for {team2Name}
                          </button>
                        </div>

                        {/* Goal Timeline / Logs */}
                        <div style={{ background: 'var(--bg-dark)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-glow)', textAlign: 'left', marginBottom: '24px' }}>
                          <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--accent-football)', marginBottom: '12px', borderBottom: '1px solid var(--border-glow)', paddingBottom: '6px' }}>
                            Match Timeline
                          </h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                            {sc.goals && sc.goals.map((g, gIdx) => (
                              <div key={gIdx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-glow)' }}>
                                <span>⚽ <strong>{g.player}</strong> ({g.team === 1 ? team1Name : team2Name})</span>
                                <span style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{g.minute}'</span>
                              </div>
                            ))}
                            {(!sc.goals || sc.goals.length === 0) && (
                              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', display: 'block', padding: '12px' }}>
                                No goals scored yet.
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Football Match Actions */}
                        <div style={{ marginTop: '32px', display: 'flex', gap: '12px', borderTop: '1px solid var(--border-glow)', paddingTop: '20px' }}>
                          <button 
                            className="btn-book-action" 
                            style={{ flex: 1, background: 'var(--bg-card-hover)', border: '1px solid var(--border-glow)', color: 'var(--text-main)' }}
                            onClick={() => setActiveScorecardBookingId(null)}
                          >
                            Save Match & Exit Scorecard
                          </button>
                          <button 
                            className="btn-book-action" 
                            style={{ flex: 1, background: 'linear-gradient(135deg, var(--accent-football) 0%, #00bfff 100%)', color: '#000', fontWeight: '900' }}
                            onClick={handleEndFootballMatch}
                          >
                            End Match & Declare Final Result
                          </button>
                        </div>

                      </div>
                    )
                  }

                  const isBattingTeam1 = sc.battingTeam === 1
                  const currentInningsScore = isBattingTeam1 ? sc.score1 : sc.score2
                  const currentInningsOvers = isBattingTeam1 ? sc.overs1 : sc.overs2

                  const handleWideWithRuns = async () => {
                    const val = await showPrompt("Enter runs ran on wide ball:", "1", "Extra runs")
                    if (val === null) return
                    const extraRuns = parseInt(val, 10) || 1
                    handleRecordBall('wide', extraRuns)
                  }

                  const handleNoBallWithRuns = async () => {
                    const val = await showPrompt("Enter runs ran on no ball:", "1", "Extra runs")
                    if (val === null) return
                    const extraRuns = parseInt(val, 10) || 1
                    handleRecordBall('no_ball', extraRuns)
                  }

                  const handleRunsWithWicket = async () => {
                    const val = await showPrompt("Enter runs completed before run-out wicket:", "1", "Runs completed")
                    if (val === null) return
                    const runsRan = parseInt(val, 10) || 1
                    handleRecordBall('runs_wicket', runsRan)
                  }

                  return (
                    <div>
                      {/* Innings Live Dashboard */}
                      <div className="innings-dashboard-grid" style={{ background: 'var(--bg-dark)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-glow)', marginBottom: '24px' }}>
                        <div>
                          <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold', color: 'var(--accent-football)' }}>
                            Active Innings: {sc.battingTeam === 1 ? sc.team1 : sc.team2} is Batting
                          </span>
                          <h1 style={{ fontSize: '48px', fontWeight: '900', color: 'var(--text-main)', fontFamily: 'monospace', margin: '8px 0' }}>
                            {currentInningsScore} <span style={{ fontSize: '20px', color: 'var(--text-muted)', fontWeight: 'bold' }}>({currentInningsOvers} Overs)</span>
                          </h1>
                          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                            Toss Winner: {sc.tossWinner} opted to {sc.tossChoice}
                          </p>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glow)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Opponent Score</span>
                          <span style={{ fontSize: '24px', fontWeight: '800', color: 'var(--accent-cricket)', fontFamily: 'monospace', marginTop: '4px' }}>
                            {sc.battingTeam === 1 ? sc.score2 : sc.score1} ({sc.battingTeam === 1 ? sc.overs2 : sc.overs1} ov)
                          </span>
                        </div>
                      </div>

                      {/* Active Batsmen & Bowler Stats grid */}
                      <div className="active-stats-grid" style={{ marginBottom: '24px' }}>
                        
                        {/* Batsmen stats */}
                        <div style={{ background: 'var(--bg-dark)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glow)' }}>
                          <div style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--accent-football)', fontWeight: 'bold', borderBottom: '1px solid var(--border-glow)', paddingBottom: '6px', marginBottom: '10px' }}>
                            Batsmen Stats
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 'bold', alignItems: 'center' }}>
                              <span>
                                {sc.striker ? (
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                    <span>🏏 {sc.striker}</span>
                                    <button 
                                      className="role-selector" 
                                      style={{ padding: '2px 6px', fontSize: '9px', borderColor: 'var(--accent-cricket)', color: 'var(--accent-cricket)', textTransform: 'uppercase', cursor: 'pointer' }}
                                      onClick={handleRetiredHurt}
                                    >
                                      Retired Hurt
                                    </button>
                                  </span>
                                ) : (
                                  <span style={{ color: 'var(--accent-cricket)', fontStyle: 'italic', paddingLeft: '22px' }}>Out - Select Next</span>
                                )}
                              </span>
                              <span style={{ fontFamily: 'monospace' }}>{sc.striker ? `${sc.strikerRuns || 0} (${sc.strikerBalls || 0})` : '-'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)' }}>
                              <span style={{ paddingLeft: '22px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {sc.nonStriker || <span style={{ fontStyle: 'italic' }}>None</span>}
                                {sc.nonStriker && (
                                  <button 
                                    className="role-selector" 
                                    style={{ padding: '2px 6px', fontSize: '9px', borderColor: 'var(--text-muted)', color: 'var(--text-muted)', textTransform: 'uppercase', cursor: 'pointer' }}
                                    onClick={handleNonStrikerRetiredHurt}
                                  >
                                    Retired Hurt
                                  </button>
                                )}
                              </span>
                              <span style={{ fontFamily: 'monospace' }}>{sc.nonStriker ? `${sc.nonStrikerRuns || 0} (${sc.nonStrikerBalls || 0})` : '-'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Bowler stats */}
                        <div style={{ background: 'var(--bg-dark)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glow)' }}>
                          <div style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--accent-cricket)', fontWeight: 'bold', borderBottom: '1px solid var(--border-glow)', paddingBottom: '6px', marginBottom: '10px' }}>
                            Bowler Stats
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 'bold' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              🏃 Bowler: {sc.bowler || <span style={{ color: 'var(--accent-cricket)', fontStyle: 'italic' }}>Select Bowler</span>}
                              {sc.bowler && (
                                <button 
                                  className="role-selector" 
                                  style={{ padding: '2px 6px', fontSize: '9px', borderColor: 'var(--text-muted)', color: 'var(--text-muted)', textTransform: 'uppercase', cursor: 'pointer' }}
                                  onClick={handleBowlerRetiredHurt}
                                >
                                  Retired Hurt
                                </button>
                              )}
                            </span>
                            <span style={{ fontFamily: 'monospace' }}>
                              {sc.bowler ? `${Math.floor((sc.bowlerBalls || 0)/6)}.${(sc.bowlerBalls || 0)%6} - ${(sc.bowlerRuns || 0)}R - ${(sc.bowlerWickets || 0)}W` : '-'}
                            </span>
                          </div>
                        </div>

                      </div>

                      {/* Select next striker popup if batsman dismissed */}
                      {!sc.striker && (
                        <div style={{ background: 'rgba(255, 71, 71, 0.05)', border: '1px solid rgba(255, 71, 71, 0.2)', padding: '16px', borderRadius: '12px', marginBottom: '24px', textAlign: 'left' }}>
                          <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--accent-cricket)', marginBottom: '8px' }}>Select New Batsman to Face Next Ball:</h4>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {getAvailableBatsmen(sc.nonStriker)
                              .map(p => (
                                <button 
                                  key={p.name}
                                  className="role-selector" 
                                  style={{ padding: '6px 12px', cursor: 'pointer' }}
                                  onClick={() => handleChooseNewStriker(p.name)}
                                >
                                  {p.name}
                                </button>
                              ))
                            }
                          </div>
                        </div>
                      )}

                      {/* Select next non-striker popup if non-striker empty (e.g. wicket on last ball of over) */}
                      {!sc.nonStriker && (
                        <div style={{ background: 'rgba(255, 71, 71, 0.05)', border: '1px solid rgba(255, 71, 71, 0.2)', padding: '16px', borderRadius: '12px', marginBottom: '24px', textAlign: 'left' }}>
                          <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--accent-cricket)', marginBottom: '8px' }}>Select New Non-Striker Batsman:</h4>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {getAvailableBatsmen(sc.striker)
                              .map(p => (
                                <button 
                                  key={p.name}
                                  className="role-selector" 
                                  style={{ padding: '6px 12px', cursor: 'pointer' }}
                                  onClick={() => handleChooseNewNonStriker(p.name)}
                                >
                                  {p.name}
                                </button>
                              ))
                            }
                          </div>
                        </div>
                      )}

                      {/* Select next bowler popup if bowler empty */}
                      {!sc.bowler && (
                        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                          <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-glow)', width: '100%', maxWidth: '400px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                            <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--accent-others)', marginBottom: '16px', textAlign: 'center' }}>Select Bowler for Next Over</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {bowlingPlayersList.map(p => {
                                const isLastBowler = sc.lastBowler?.includes(p.name) && bowlingPlayersList.length > 1;
                                return (
                                  <button 
                                    key={p.name}
                                    className="role-selector" 
                                    style={{ 
                                      padding: '12px 16px', 
                                      cursor: isLastBowler ? 'not-allowed' : 'pointer',
                                      opacity: isLastBowler ? 0.5 : 1,
                                      textDecoration: isLastBowler ? 'line-through' : 'none',
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      background: isLastBowler ? 'var(--bg-dark)' : 'var(--bg-card-hover)',
                                      color: isLastBowler ? 'var(--text-muted)' : 'var(--text-main)',
                                      borderColor: 'var(--border-glow)'
                                    }}
                                    disabled={isLastBowler}
                                    onClick={() => handleChooseNewBowler(p.name)}
                                  >
                                    <span>{p.name}</span>
                                    {isLastBowler && <span style={{ fontSize: '11px', color: 'var(--accent-cricket)' }}>Just Bowled</span>}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* BALL INPUT BUTTONS PANEL */}
                      <div style={{ background: 'var(--bg-dark)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-glow)' }}>
                        <div style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold', marginBottom: '12px' }}>
                          Ball outcomes (Select outcome to record ball)
                        </div>
                        
                        <div className="scoring-grid-buttons">
                          <button className="btn-score-circle" disabled={!sc.striker || !sc.bowler} onClick={() => handleRecordBall('run', 0)}>0</button>
                          <button className="btn-score-circle" disabled={!sc.striker || !sc.bowler} onClick={() => handleRecordBall('run', 1)}>1</button>
                          <button className="btn-score-circle" disabled={!sc.striker || !sc.bowler} onClick={() => handleRecordBall('run', 2)}>2</button>
                          <button className="btn-score-circle" disabled={!sc.striker || !sc.bowler} onClick={() => handleRecordBall('run', 3)}>3</button>
                          <button className="btn-score-circle" disabled={!sc.striker || !sc.bowler} onClick={() => handleRecordBall('run', 4)}>4 (Four)</button>
                          <button className="btn-score-circle" disabled={!sc.striker || !sc.bowler} onClick={() => handleRecordBall('run', 6)}>6 (Six)</button>
                          <button className="btn-score-circle" disabled={!sc.striker || !sc.bowler} onClick={() => handleRecordBall('wide', 0)}>Wd</button>
                          <button className="btn-score-circle" disabled={!sc.striker || !sc.bowler} onClick={() => handleRecordBall('no_ball', 0)}>Nb</button>
                          <button className="btn-score-circle wicket" disabled={!sc.striker || !sc.bowler} onClick={() => handleRecordBall('wicket')}>Wicket</button>
                          <button className="btn-score-circle" disabled={!sc.striker || !sc.bowler} onClick={handleWideWithRuns}>Wd + Runs</button>
                          <button className="btn-score-circle" disabled={!sc.striker || !sc.bowler} onClick={handleNoBallWithRuns}>Nb + Runs</button>
                          <button className="btn-score-circle wicket" disabled={!sc.striker || !sc.bowler} onClick={handleRunsWithWicket}>Runs + Wkt</button>
                        </div>
                      </div>

                      {/* Current over display */}
                      <div style={{ marginTop: '24px', textAlign: 'left' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                          <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-muted)', margin: 0 }}>Balls in Over:</h4>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              className="role-selector" 
                              style={{ padding: '4px 10px', fontSize: '11px', borderColor: 'orange', color: 'orange', cursor: 'pointer' }}
                              disabled={!sc.ballsThisOver || sc.ballsThisOver.length === 0}
                              onClick={handleEditLastBall}
                            >
                              ✏️ Edit Last Ball
                            </button>
                            <button 
                              className="role-selector" 
                              style={{ padding: '4px 10px', fontSize: '11px', borderColor: 'rgba(255,71,71,0.6)', color: 'rgba(255,71,71,0.9)', cursor: 'pointer' }}
                              disabled={!sc.undoStack || sc.undoStack.length === 0}
                              onClick={handleUndoLastBall}
                            >
                              ↩️ Undo Ball
                            </button>
                          </div>
                        </div>
                        <div className="over-balls-list">
                          {sc.ballsThisOver?.map((ballVal, bIdx) => {
                            const isObj = typeof ballVal === 'object' && ballVal !== null
                            const label = isObj ? ballVal.label : ballVal
                            const originalLabel = isObj ? ballVal.originalLabel : ''
                            const isEdited = isObj && ballVal.edited

                            let extraClass = ''
                            if (label.includes('W')) extraClass = 'wicket-ball'
                            else if (label === '4') extraClass = 'boundary-4'
                            else if (label === '6') extraClass = 'boundary-6'

                            return (
                              <span key={bIdx} className={`over-ball-tag ${extraClass}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                {isEdited ? (
                                  <>
                                    <span style={{ textDecoration: 'line-through', opacity: 0.6 }}>{originalLabel}</span>
                                    <span>{label}</span>
                                  </>
                                ) : (
                                  label
                                )}
                              </span>
                            )
                          })}
                          {(!sc.ballsThisOver || sc.ballsThisOver.length === 0) && (
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>No balls bowled in this over yet.</span>
                          )}
                        </div>
                      </div>


                      {/* Innings & Match Actions */}
                      <div style={{ marginTop: '32px', display: 'flex', gap: '12px', borderTop: '1px solid var(--border-glow)', paddingTop: '20px' }}>
                        <button 
                          className="btn-book-action" 
                          style={{ flex: 1, background: 'var(--bg-card-hover)', border: '1px solid var(--border-glow)', color: 'var(--text-main)' }}
                          onClick={() => setActiveScorecardBookingId(null)}
                        >
                          Save Match & Exit Scorecard
                        </button>
                        <button 
                          className="btn-book-action" 
                          style={{ flex: 1 }}
                          onClick={handleDeclareInnings}
                        >
                          {sc.battingTeam === 1 ? 'Declare 1st Innings & Swap Teams' : 'End Match & Declare Final Winner'}
                        </button>
                      </div>

                      {/* Cricbuzz Style Scorecard */}
                      <div style={{ marginTop: '40px', borderTop: '1px solid var(--border-glow)', paddingTop: '24px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '16px' }}>Full Scorecard</h3>
                        
                        {/* Batting Table */}
                        <div className="scorecard-table-wrapper" style={{ marginBottom: '24px' }}>
                          <table className="scorecard-table">
                            <thead>
                              <tr>
                                <th className="scorecard-th">Batter</th>
                                <th className="scorecard-th"></th>
                                <th className="scorecard-th" style={{ textAlign: 'right' }}>R</th>
                                <th className="scorecard-th" style={{ textAlign: 'right' }}>B</th>
                                <th className="scorecard-th" style={{ textAlign: 'right' }}>4s</th>
                                <th className="scorecard-th" style={{ textAlign: 'right' }}>6s</th>
                                <th className="scorecard-th" style={{ textAlign: 'right' }}>SR</th>
                              </tr>
                            </thead>
                            <tbody>
                              {battingPlayersList.map(p => {
                                const stats = (sc.battingStats || {})[p.name];
                                if (!stats && p.name !== sc.striker && p.name !== sc.nonStriker) return null;
                                const s = stats || { runs: 0, balls: 0, fours: 0, sixes: 0, out: false };
                                
                                let dismissalText = s.out ? (s.dismissalInfo || 'Out') : 'Not Out';
                                if (s.retired) dismissalText = 'Retired Hurt';
                                if (p.name === sc.striker) dismissalText = 'Batting*';
                                if (p.name === sc.nonStriker) dismissalText = 'Batting';

                                const sr = s.balls > 0 ? ((s.runs / s.balls) * 100).toFixed(1) : '-';

                                return (
                                  <tr key={p.name}>
                                    <td className="scorecard-td scorecard-player-name">{p.name} {p.name === sc.striker ? '*' : ''}</td>
                                    <td className="scorecard-td scorecard-td-muted" style={{ fontSize: '12px' }}>{dismissalText}</td>
                                    <td className="scorecard-td scorecard-td-bold" style={{ textAlign: 'right' }}>{s.runs}</td>
                                    <td className="scorecard-td" style={{ textAlign: 'right' }}>{s.balls}</td>
                                    <td className="scorecard-td" style={{ textAlign: 'right' }}>{s.fours || 0}</td>
                                    <td className="scorecard-td" style={{ textAlign: 'right' }}>{s.sixes || 0}</td>
                                    <td className="scorecard-td" style={{ textAlign: 'right' }}>{sr}</td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Bowling Table */}
                        <div className="scorecard-table-wrapper">
                          <table className="scorecard-table">
                            <thead>
                              <tr>
                                <th className="scorecard-th">Bowler</th>
                                <th className="scorecard-th" style={{ textAlign: 'right' }}>O</th>
                                <th className="scorecard-th" style={{ textAlign: 'right' }}>M</th>
                                <th className="scorecard-th" style={{ textAlign: 'right' }}>R</th>
                                <th className="scorecard-th" style={{ textAlign: 'right' }}>W</th>
                                <th className="scorecard-th" style={{ textAlign: 'right' }}>ECON</th>
                              </tr>
                            </thead>
                            <tbody>
                              {bowlingPlayersList.map(p => {
                                const stats = (sc.bowlingStats || {})[p.name];
                                if (!stats && p.name !== sc.bowler && p.name !== sc.lastBowler) return null;
                                const s = stats || { runs: 0, balls: 0, wickets: 0, maidens: 0 };
                                
                                const overs = `${Math.floor(s.balls / 6)}.${s.balls % 6}`;
                                const econ = s.balls > 0 ? ((s.runs / s.balls) * 6).toFixed(1) : '-';

                                return (
                                  <tr key={p.name}>
                                    <td className="scorecard-td scorecard-player-name">{p.name} {p.name === sc.bowler ? '*' : ''}</td>
                                    <td className="scorecard-td" style={{ textAlign: 'right' }}>{overs}</td>
                                    <td className="scorecard-td" style={{ textAlign: 'right' }}>{s.maidens || 0}</td>
                                    <td className="scorecard-td" style={{ textAlign: 'right' }}>{s.runs}</td>
                                    <td className="scorecard-td scorecard-td-bold" style={{ textAlign: 'right', color: 'var(--accent-cricket)' }}>{s.wickets}</td>
                                    <td className="scorecard-td" style={{ textAlign: 'right' }}>{econ}</td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>


                    </div>
                  )
                })()}

              </div>
            </div>
          )
        })()}
          </div>
        )}

      {/* ── Toast Containers ── */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast-item toast-${toast.type}`}>
            <span style={{ fontSize: '16px' }}>
              {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}
            </span>
            <div>{toast.message}</div>
          </div>
        ))}
      </div>

      {/* ── Coin Flip Dialog Overlay ── */}
      {tossCoinState.showModal && (
        <div className="custom-modal-overlay" style={{ zIndex: 10000 }}>
          <div className="custom-modal-card" style={{ textAlign: 'center', background: 'var(--bg-card)', padding: '40px', border: '1px solid var(--border-glow)' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '30px', color: 'var(--text-main)' }}>
              {tossCoinState.spinning ? 'Flipping the Coin...' : 'Toss Result'}
            </h3>
            
            <div className="coin-container">
              <div className={`coin ${tossCoinState.spinning ? 'spinning' : ''} ${!tossCoinState.spinning && tossCoinState.winner === 2 ? 'flip-tails' : 'flip-heads'}`}>
                <div className="coin-face coin-front">A</div>
                <div className="coin-face coin-back">B</div>
              </div>
            </div>

            <div style={{ marginTop: '40px', minHeight: '60px' }}>
              {tossCoinState.spinning ? (
                <div style={{ color: 'var(--text-muted)' }}>Waiting for outcome...</div>
              ) : (
                <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                  <div style={{ fontSize: '22px', color: tossCoinState.winner === 1 ? 'var(--accent-football)' : 'var(--accent-cricket)', fontWeight: '900' }}>
                    Team {tossCoinState.winner === 1 ? 'A' : 'B'} won the Toss!
                  </div>
                  <div style={{ fontSize: '18px', color: 'var(--text-main)', marginTop: '8px' }}>
                    They chose to <strong style={{ color: 'var(--accent-others)' }}>{tossCoinState.choice}</strong>
                  </div>
                </div>
              )}
            </div>
            
            {!tossCoinState.spinning && (
              <button 
                className="btn-book-action" 
                style={{ marginTop: '20px', width: '100%' }}
                onClick={() => setTossCoinState(prev => ({ ...prev, showModal: false }))}
              >
                Continue
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Custom Modal Dialog Overlay ── */}
      {customModal && (
        <div className="custom-modal-overlay">
          <form className="custom-modal-card" onSubmit={handleModalSubmit}>
            <div className="custom-modal-title">{customModal.title}</div>
            <div className="custom-modal-message">{customModal.message}</div>
            
            {customModal.type === 'prompt' && (
              <input
                type="text"
                className="custom-modal-input"
                value={modalInputValue}
                onChange={e => setModalInputValue(e.target.value)}
                placeholder={customModal.placeholder || 'Enter value...'}
                autoFocus
              />
            )}

            {customModal.type === 'select' && (
              <select
                className="custom-modal-select"
                value={modalInputValue}
                onChange={e => setModalInputValue(e.target.value)}
                autoFocus
              >
                {customModal.options?.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            )}

            <div className="custom-modal-actions">
              {(customModal.type === 'confirm' || customModal.type === 'prompt' || customModal.type === 'select') && (
                <button
                  type="button"
                  className="custom-modal-btn custom-modal-btn-secondary"
                  onClick={handleModalCancel}
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="custom-modal-btn custom-modal-btn-primary"
              >
                {customModal.type === 'confirm' ? 'Yes' : 'OK'}
              </button>
            </div>
          </form>
        </div>
      )}
      </main>
    </>
  )
}

export default App
