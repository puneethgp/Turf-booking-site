import { useState, useMemo } from 'react'
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
  const [selectedSport, setSelectedSport] = useState(null)
  const [selectedTurf, setSelectedTurf] = useState(1)
  const [selectedDateIndex, setSelectedDateIndex] = useState(0)

  const activeSport = useMemo(() => {
    return sports.find(s => s.id === selectedSport)
  }, [selectedSport])
  
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [authTab, setAuthTab] = useState('login') // 'login' or 'register'
  const [currentUser, setCurrentUser] = useState(null)
  const [viewingDashboard, setViewingDashboard] = useState(false)
  const [expandedDayIndex, setExpandedDayIndex] = useState(null)

  // System Configuration (Floodlights peak timing set by Owner)
  const [floodlightStartHour, setFloodlightStartHour] = useState(19) // default 7 PM (19:00)

  // Simulation Role selector (for navbar simulation shortcuts)
  const [userRole, setUserRole] = useState('captain') 

  // Register Fields
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regRole, setRegRole] = useState('player')
  const [isExistingPlayerToggle, setIsExistingPlayerToggle] = useState(false)
  const [playerSearchQuery, setPlayerSearchQuery] = useState('')
  const [selectedShadowProfile, setSelectedShadowProfile] = useState(null)

  // Simulated Profiles & Shadow Players Database
  const [profiles, setProfiles] = useState([
    { id: 'p1', name: 'Rahul (Captain)', email: 'rahul.strikers@gmail.com', role: 'player', runs: 342, wickets: 12, matches: 14, isShadow: false },
    { id: 'p2', name: 'Vikram', email: 'vikram.play@yahoo.com', role: 'player', runs: 85, wickets: 3, matches: 5, isShadow: false },
    { id: 'p3', name: 'Amit (Owner)', email: 'amit.owner@smashnroast.com', role: 'owner', runs: 0, wickets: 0, matches: 0, isShadow: false },
    { id: 'p4', name: 'Super Admin', email: 'puneethgp18@gmail.com', role: 'admin', runs: 0, wickets: 0, matches: 0, isShadow: false },
    // Shadow profiles (no email/gmail tagged)
    { id: 'shadow_1', name: 'Ramesh Offline', email: null, role: 'player', runs: 180, wickets: 6, matches: 8, isShadow: true, claimCode: 'SR-7B9A2' },
    { id: 'shadow_2', name: 'Sunil Shadow', email: null, role: 'player', runs: 95, wickets: 2, matches: 4, isShadow: true, claimCode: 'SR-4X1Y8' },
    { id: 'shadow_3', name: 'Deepak Rao', email: null, role: 'player', runs: 210, wickets: 8, matches: 9, isShadow: true, claimCode: 'SR-2M5N8' }
  ])

  // Virtual Groups Database (renamed from Virtual Teams)
  const [groups, setGroups] = useState([
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
  ])

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

  // In-memory simulated bookings database with timestamps to show priority booking list
  const [bookings, setBookings] = useState([
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
  ])



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
  const [tossCoinState, setTossCoinState] = useState({ spinning: false, winner: null, choice: null })
  const [batsmanStriker, setBatsmanStriker] = useState('')
  const [batsmanNonStriker, setBatsmanNonStriker] = useState('')
  const [currentBowler, setCurrentBowler] = useState('')


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

      if (bookedBooking && bookedBooking.openToJoin) {
        setSelectedBookedSlotId(bookedBooking.id)
        setSelectedHours([]) // Clear other hours selection
        return
      }

      alert('This slot is already booked or is awaiting owner approval!')
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
      alert('You must log in to reserve a turf!')
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
      status: userRole === 'owner' ? 'booked_private' : 'pending_approval',
      teamName: selectedGroupName,
      playerCount: initialMatchPlayers.length,
      ownerApproved: userRole === 'owner',
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

    setBookings(prev => [...prev, newBooking])
    setSelectedHours([])
    alert(userRole === 'owner' ? 'Booking confirmed immediately!' : 'Booking requested! Owner approval pending.')
  }

  // Create Account with existing shadow profile tag strategy
  const handleRegister = (e) => {
    e.preventDefault()
    if (!regName || !regEmail) {
      alert('Please fill out all fields!')
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

      alert(`Claimed player profile! "${selectedShadowProfile.name}" is now linked to ${regEmail} with all past stats imported!`)
    } else {
      // Normal registration: Default every profile is player profile
      newUser = {
        id: 'p' + (profiles.length + 1),
        name: regName,
        email: regEmail,
        role: regRole, // Defaults to player unless admin creates owner profile
        runs: regRole === 'player' ? 0 : null,
        wickets: regRole === 'player' ? 0 : null,
        matches: regRole === 'player' ? 0 : null
      }
      setProfiles(prev => [...prev, newUser])
      alert(`Account created successfully as ${regRole.toUpperCase()}!`)
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
      alert(`Shadow Player Profile Created!\nName: ${newShadowName}\nClaim Code: ${claimCode}\nThis player can now register later and claim their stats!`)
    } else {
      alert(`Profile Created!\nName: ${newShadowName}\nEmail: ${newShadowEmail}\nRole: ${roleToCreate.toUpperCase()}`)
    }
  }

  const handleCreateGroup = (e) => {
    e.preventDefault()
    if (!newGroupName) return

    const userCreatedCount = groups.filter(g => g.creator === currentUser.name).length
    if (currentUser.role === 'player' && userCreatedCount >= 2) {
      alert('Error: You can only create a maximum of 2 groups!')
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
    alert(`Group "${newGroupName}" created successfully!`)
  }

  const handleAddGroupMember = (groupId, playerProfileId) => {
    const profile = profiles.find(p => p.id === playerProfileId)
    if (!profile) return

    setGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        const exists = group.members.some(m => m.name === profile.name || (profile.email && m.email === profile.email))
        if (exists) {
          alert('Player is already in this group!')
          return group
        }
        return {
          ...group,
          members: [...group.members, { 
            name: profile.name, 
            email: profile.email || null, 
            isShadow: profile.isShadow, 
            claimCode: profile.claimCode || null 
          }]
        }
      }
      return group
    }))
    alert(`Added "${profile.name}" to group!`)
  }

  const handleRemoveGroupMember = (groupId, memberName) => {
    setGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        if (memberName === group.creator || (group.creator.includes('Rahul') && memberName.includes('Rahul'))) {
          alert('Cannot remove the Group Creator!')
          return group
        }
        return {
          ...group,
          members: group.members.filter(m => m.name !== memberName)
        }
      }
      return group
    }))
    alert(`Removed member "${memberName}" from group.`)
  }

  const handleJoinMatchRequest = (bookingId, count) => {
    if (!isLoggedIn) {
      alert('You must log in to request to join a match!')
      setShowLoginModal(true)
      return
    }

    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        const alreadyRequested = b.joinRequests.some(r => r.playerName === currentUser.name)
        if (alreadyRequested) {
          alert('You have already requested to join this match!')
          return b
        }
        alert(`Join request sent to captain for ${count} player(s)!`)
        return {
          ...b,
          joinRequests: [...b.joinRequests, { 
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
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        const req = b.joinRequests.find(r => r.id === requestId)
        if (!req) return b

        const count = req.count || 1
        alert(`Approved ${req.playerName}'s request to join with ${count} player(s)!`)

        const newPlayers = []
        for (let i = 0; i < count; i++) {
          newPlayers.push({
            name: i === 0 ? req.playerName : `${req.playerName} (Guest ${i})`,
            email: i === 0 ? req.email : null,
            isShadow: i > 0,
            team: null
          })
        }

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
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        alert('Join request rejected.')
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
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        alert(`Removed ${playerName} from match roster.`)
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

    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        const exists = b.matchPlayers.some(p => p.name === profile.name)
        if (exists) {
          alert('Player is already in the match roster!')
          return b
        }
        alert(`Added ${profile.name} to match roster.`)
        return {
          ...b,
          playerCount: b.playerCount + 1,
          matchPlayers: [...b.matchPlayers, {
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
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        alert('Booking Approved Successfully!')
        return { ...b, ownerApproved: true, status: 'booked_private' }
      }
      return b
    }))
  }

  const handleOwnerRejectBooking = (bookingId) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId))
    setSelectedHours([])
    alert('Booking Rejected and slot freed.')
  }

  // Claim/Link Shadow Profile click
  const handleSelectShadowProfile = (profile) => {
    setSelectedShadowProfile(profile)
    setRegName(profile.name)
    setPlayerSearchQuery(profile.name)
  }

  const handleDemoLogin = (profile) => {
    let userProfile = {}
    if (profile === 'captain') {
      userProfile = profiles.find(p => p.email === 'rahul.strikers@gmail.com')
    } else if (profile === 'guest') {
      userProfile = profiles.find(p => p.email === 'vikram.play@yahoo.com')
    } else if (profile === 'owner') {
      userProfile = profiles.find(p => p.email === 'amit.owner@smashnroast.com')
    } else if (profile === 'admin') {
      userProfile = profiles.find(p => p.email === 'puneethgp18@gmail.com')
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

  return (
    <>
      {/* Navigation Header */}
      <nav className="navbar">
        <a href="/" className="logo-container" onClick={(e) => { e.preventDefault(); setSelectedSport(null); setViewingDashboard(false); setScoringMatchId(null); }}>
          <span className="logo-icon">SR</span>
          <span className="logo-text">SMASH <span>&</span> ROAST</span>
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
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'bold' }}>SIMULATOR:</span>
            <select 
              className="role-selector" 
              value={userRole}
              onChange={(e) => { setUserRole(e.target.value); setSelectedHours([]); }}
            >
              <option value="captain">Player Captain (Rahul)</option>
              <option value="guest">Guest Player (Vikram)</option>
              <option value="owner">Venue Owner (Amit)</option>
            </select>
          </div>
        </div>
      </nav>

      {/* Main View Area */}
      <main style={{ width: '100%' }}>
        
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
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
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

        {/* LOGGED IN USER DASHBOARD */}
        {viewingDashboard && isLoggedIn ? (
          <div className="dashboard-container">
            <div className="dashboard-header">
              <div>
                <h1 className="hero-title" style={{ fontSize: '36px', textAlign: 'left', marginBottom: '4px' }}>Dashboard Workspace</h1>
                <p style={{ color: 'var(--text-muted)' }}>Manage user profiles, timing boundaries, and bookings approval.</p>
              </div>
              <button className="btn-login" onClick={() => { setViewingDashboard(false); setSelectedSport('cricket'); }}>Book Turf Now</button>
            </div>

            {/* ==============================================
                ADMIN VIEW PANEL (puneethgp18@gmail.com)
                ============================================== */}
            {currentUser.role === 'admin' && (
              <div style={{ background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '24px', borderRadius: '16px', marginBottom: '32px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>
                  <Shield size={20} style={{ color: 'var(--accent-others)' }} /> Admin Console (puneethgp18@gmail.com)
                </h3>
                
                {/* Create profile form: Only admin can create Owners */}
                <form onSubmit={handleOwnerAdminCreateProfile} style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', marginBottom: '20px', maxWidth: '500px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>Create User Profile (Owner / Player)</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <input 
                      type="text" 
                      placeholder="Display Name" 
                      className="login-input" 
                      style={{ marginBottom: '0' }}
                      required
                      value={newShadowName}
                      onChange={(e) => setNewShadowName(e.target.value)}
                    />
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      className="login-input"
                      style={{ marginBottom: '0' }}
                      required
                      value={newShadowEmail}
                      onChange={(e) => setNewShadowEmail(e.target.value)}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Role:</span>
                    <select 
                      className="role-selector" 
                      value={regRole} 
                      onChange={(e) => setRegRole(e.target.value)}
                    >
                      <option value="player">Player</option>
                      <option value="owner">Owner</option>
                    </select>
                    <button type="submit" className="btn-cart-book" style={{ padding: '8px 20px', fontSize: '13px' }}>
                      Register Profile
                    </button>
                  </div>
                </form>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-glow)', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '10px' }}>Name</th>
                        <th style={{ padding: '10px' }}>Email / Claim Status</th>
                        <th style={{ padding: '10px' }}>Role</th>
                        <th style={{ padding: '10px' }}>Access Permissions & Management Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profiles.map(p => {
                        const isCurrent = p.name === currentUser.name || p.email === currentUser.email
                        let permissions = 'Create teams (max 2), Book slots, Join open matches'
                        if (p.role === 'admin') permissions = 'Superuser: Manage Owners, Create Profiles, Timing bounds'
                        else if (p.role === 'owner') permissions = 'Manage Floodlight Timings, Booking Approvals, Create shadow players'

                        return (
                          <tr key={p.id} style={{ borderBottom: '1px solid var(--border-glow)', background: isCurrent ? 'rgba(0, 255, 102, 0.03)' : '' }}>
                            <td style={{ padding: '10px', fontWeight: 'bold' }}>
                              {p.name} {isCurrent && <span style={{ color: 'var(--accent-football)', fontSize: '10px', marginLeft: '6px' }}>(Logged In)</span>}
                            </td>
                            <td style={{ padding: '10px' }}>
                              {p.isShadow ? (
                                <span style={{ color: 'var(--accent-cricket)' }}>Offline Player (Claim Code: {p.claimCode})</span>
                              ) : (
                                p.email
                              )}
                            </td>
                            <td style={{ padding: '10px' }}>
                              <span style={{ 
                                padding: '2px 8px', 
                                borderRadius: '4px', 
                                fontSize: '10px', 
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                background: p.role === 'admin' ? 'var(--accent-others)' : p.role === 'owner' ? 'var(--accent-cricket)' : 'var(--accent-football)',
                                color: '#000'
                              }}>{p.role}</span>
                            </td>
                            <td style={{ padding: '10px', color: 'var(--text-muted)', fontSize: '12px' }}>{permissions}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ==============================================
                OWNER PANEL (MANAGE TIMINGS & BOOKINGS PRIORITY)
                ============================================== */}
            {(currentUser.role === 'owner' || currentUser.role === 'admin') && (
              <div style={{ background: 'rgba(255, 71, 71, 0.03)', border: '1px solid rgba(255, 71, 71, 0.15)', padding: '24px', borderRadius: '16px', marginBottom: '32px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Owner Account Console</h3>
                
                {/* Owner Venue Statistics */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Venue Owners</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {profiles.filter(p => p.role === 'owner' || p.role === 'admin').map(owner => {
                        const isCurrent = owner.name === currentUser.name || owner.email === currentUser.email
                        return (
                          <div key={owner.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                            <span style={{ fontWeight: 'bold' }}>
                              {owner.name} {isCurrent && <span style={{ color: 'var(--accent-football)', fontSize: '9px' }}>(Logged In)</span>}
                            </span>
                            <span style={{ color: 'var(--text-muted)' }}>{owner.email}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Total Groups Registered</span>
                    <span style={{ fontSize: '36px', fontWeight: '900', color: 'var(--accent-football)', marginTop: '4px' }}>{groups.length}</span>
                  </div>
                </div>

                {/* Create User Profile (Gmail Optional) */}
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', marginBottom: '24px', maxWidth: '600px' }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                    <Plus size={16} /> Add Player Profile (Gmail Optional)
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '12px' }}>
                    Create a player profile. Leave Gmail blank to create a shadow player with a claim code (tag code), which players can claim later.
                  </p>
                  <form onSubmit={handleOwnerAdminCreateProfile} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <input 
                      type="text" 
                      placeholder="Player Name (e.g. Ramesh)" 
                      className="login-input" 
                      style={{ marginBottom: '0' }}
                      required
                      value={newShadowName}
                      onChange={(e) => setNewShadowName(e.target.value)}
                    />
                    <input 
                      type="email" 
                      placeholder="Gmail Address (Optional)" 
                      className="login-input"
                      style={{ marginBottom: '0' }}
                      value={newShadowEmail}
                      onChange={(e) => setNewShadowEmail(e.target.value)}
                    />
                    <button type="submit" className="btn-cart-book" style={{ gridColumn: 'span 2', padding: '10px', fontSize: '13px' }}>
                      Add Player Profile
                    </button>
                  </form>
                </div>

                {/* 1. Manage Timings (Floodlight settings) */}
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', marginBottom: '24px', maxWidth: '600px' }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                    <Flame size={16} /> Manage Floodlight Timings (Peak Rate Boundary)
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '12px' }}>
                    Set the hour when floodlights are turned on. Slots at or after this hour incur an extra Rs. 100/hour rate.
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <select 
                      className="role-selector" 
                      value={floodlightStartHour}
                      onChange={(e) => {
                        setFloodlightStartHour(parseInt(e.target.value, 10))
                        alert(`Floodlight timing updated! Peak pricing starts at ${e.target.value}:00.`)
                      }}
                    >
                      <option value="17">05:00 PM</option>
                      <option value="18">06:00 PM</option>
                      <option value="19">07:00 PM</option>
                      <option value="20">08:00 PM</option>
                    </select>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--accent-football)' }}>
                      Current Peak Rate Boundary: {floodlightStartHour > 12 ? `${floodlightStartHour - 12} PM` : `${floodlightStartHour} AM`}
                    </span>
                  </div>
                </div>

                {/* 2. Approve Requests with Booking Priority dates */}
                <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>Booking Approval Queue (Ordered by Request Date - Oldest First)</h4>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-glow)', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '10px' }}>Booker</th>
                        <th style={{ padding: '10px' }}>Turf Choice</th>
                        <th style={{ padding: '10px' }}>Match Schedule</th>
                        <th style={{ padding: '10px' }}>Request Timestamp (Priority)</th>
                        <th style={{ padding: '10px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.filter(b => b.status === 'pending_approval').sort((a,b) => new Date(a.requestedAt) - new Date(b.requestedAt)).map(b => (
                        <tr key={b.id} style={{ borderBottom: '1px solid var(--border-glow)' }}>
                          <td style={{ padding: '10px', fontWeight: 'bold' }}>{b.captainName}</td>
                          <td style={{ padding: '10px' }}>Turf {b.turfId}</td>
                          <td style={{ padding: '10px' }}>{dates[b.dateIndex].formatted} @ {b.time} ({b.duration} hour)</td>
                          <td style={{ padding: '10px', color: 'var(--text-muted)' }}>
                            {new Date(b.requestedAt).toLocaleString()}
                          </td>
                          <td style={{ padding: '10px' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button className="btn-approve" onClick={() => handleOwnerApproveBooking(b.id)}>Approve</button>
                              <button className="btn-reject" onClick={() => handleOwnerRejectBooking(b.id)}>Reject</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {bookings.filter(b => b.status === 'pending_approval').length === 0 && (
                        <tr>
                          <td colSpan="5" style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            No pending booking requests in approval queue.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Standard Dashboard Grid */}
            <div className="dashboard-grid">
              
              {/* Profile Details & Personal Stats */}
              <div className="dashboard-sidebar-card">
                <div className="profile-avatar">{currentUser.name.charAt(0)}</div>
                <h3 style={{ fontSize: '20px', fontWeight: '800' }}>{currentUser.name}</h3>
                <span className="member-badge" style={{ textTransform: 'uppercase' }}>{currentUser.role}</span>
                
                <ul className="dashboard-list">
                  <li className="dashboard-list-item">
                    <span style={{ color: 'var(--text-muted)' }}>Email:</span>
                    <span>{currentUser.email}</span>
                  </li>
                  {currentUser.role === 'player' && (
                    <>
                      <li className="dashboard-list-item" style={{ borderBottom: 'none', fontWeight: 'bold', marginTop: '10px' }}>
                        <span>CRICKET PORTAL STATS:</span>
                      </li>
                      <li className="dashboard-list-item">
                        <span style={{ color: 'var(--text-muted)' }}>Matches Played:</span>
                        <span style={{ color: 'var(--accent-football)', fontWeight: 'bold' }}>{currentUser.matches}</span>
                      </li>
                      <li className="dashboard-list-item">
                        <span style={{ color: 'var(--text-muted)' }}>Total Runs Scored:</span>
                        <span style={{ color: 'var(--accent-football)', fontWeight: 'bold' }}>{currentUser.runs}</span>
                      </li>
                      <li className="dashboard-list-item">
                        <span style={{ color: 'var(--text-muted)' }}>Wickets Taken:</span>
                        <span style={{ color: 'var(--accent-football)', fontWeight: 'bold' }}>{currentUser.wickets}</span>
                      </li>
                    </>
                  )}
                </ul>

                {/* Group Creation Module */}
                {(currentUser.role === 'player' || currentUser.role === 'owner' || currentUser.role === 'admin') && (
                  <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-glow)', paddingTop: '20px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
                      Create Booking Group {currentUser.role === 'player' ? '(Max 2 Limit)' : '(Unlimited)'}
                    </h4>
                    
                    <form onSubmit={handleCreateGroup} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <input 
                        type="text" 
                        placeholder="New Group Name" 
                        className="login-input" 
                        style={{ padding: '8px 12px', margin: '0' }}
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                      />
                      <select 
                        className="role-selector"
                        value={newGroupSport}
                        onChange={(e) => setNewGroupSport(e.target.value)}
                      >
                        <option value="cricket">Cricket</option>
                        <option value="football">Football</option>
                        <option value="others">Others</option>
                      </select>
                      <button type="submit" className="btn-login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%' }}>
                        <Plus size={14} /> Create Group
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* Previous Bookings & Match Scores Section */}
              <div className="dashboard-matches-card" style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={20} style={{ color: 'var(--accent-football)' }} /> Previous Bookings & Match Results
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {bookings
                    .filter(b => b.captainName === currentUser.name || (currentUser.name && currentUser.name.includes('Rahul') && b.captainName && b.captainName.includes('Rahul')))
                    .map(booking => {
                      const isExpanded = expandedDayIndex === booking.id
                      const dateText = booking.dateFormatted || (dates[booking.dateIndex] ? dates[booking.dateIndex].formatted : 'Upcoming Date')
                      const isCricket = booking.sportId === 'cricket'
                      
                      return (
                        <div 
                          key={booking.id} 
                          style={{ 
                            background: 'rgba(255,255,255,0.01)', 
                            border: '1px solid var(--border-glow)', 
                            borderRadius: '12px', 
                            padding: '16px',
                            cursor: 'pointer',
                            transition: 'var(--transition-smooth)'
                          }}
                          onClick={() => setExpandedDayIndex(isExpanded ? null : booking.id)}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontWeight: 'bold', fontSize: '15px' }}>
                                {dateText} @ {booking.time}
                              </div>
                              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                {isCricket ? '🏏 Cricket' : '⚽ Football'} • Turf {booking.turfId} • {booking.teamName} ({booking.playerCount} players)
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ 
                                fontSize: '10px', 
                                fontWeight: 'bold', 
                                textTransform: 'uppercase', 
                                padding: '3px 8px', 
                                borderRadius: '4px',
                                background: booking.status === 'completed' ? 'rgba(0, 255, 102, 0.1)' : booking.status === 'pending_approval' ? 'rgba(255, 165, 0, 0.1)' : 'rgba(0, 150, 255, 0.1)',
                                color: booking.status === 'completed' ? 'var(--accent-football)' : booking.status === 'pending_approval' ? 'orange' : '#00bfff'
                              }}>
                                {booking.status === 'booked_private' ? 'Approved' : booking.status === 'booked_open' ? 'Open Match' : booking.status}
                              </span>
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </div>
                          </div>

                          {/* Expanded Details: matches, scores, results */}
                          {isExpanded && (
                            <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border-glow)' }}>
                              
                              {(() => {
                                const isCaptain = booking.captainName === currentUser.name || (currentUser.name && currentUser.name.includes('Rahul') && booking.captainName && booking.captainName.includes('Rahul')) || currentUser.role === 'admin'
                                
                                return (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    
                                    {/* LINEUP BREAKDOWN DISPLAY */}
                                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glow)' }}>
                                      <div style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold', color: 'var(--accent-football)', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Playing Team Lineups</span>
                                        <span>Total: {booking.matchPlayers?.length || 0} Players</span>
                                      </div>
                                      
                                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div style={{ background: 'rgba(255,255,255,0.01)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                          <div style={{ fontWeight: 'bold', fontSize: '13px', color: 'var(--accent-football)', borderBottom: '1px solid var(--border-glow)', paddingBottom: '4px', marginBottom: '8px' }}>
                                            {booking.scoreCard?.team1 || 'Team A'}
                                          </div>
                                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            {booking.matchPlayers?.filter(p => p.team === 1).map((p, idx) => (
                                              <div key={idx} style={{ fontSize: '12px', color: 'var(--text-main)' }}>• {p.name}</div>
                                            ))}
                                            {booking.matchPlayers?.filter(p => p.team === 1).length === 0 && (
                                              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>No players assigned</div>
                                            )}
                                          </div>
                                        </div>
                                        
                                        <div style={{ background: 'rgba(255,255,255,0.01)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                          <div style={{ fontWeight: 'bold', fontSize: '13px', color: 'var(--accent-cricket)', borderBottom: '1px solid var(--border-glow)', paddingBottom: '4px', marginBottom: '8px' }}>
                                            {booking.scoreCard?.team2 || 'Team B'}
                                          </div>
                                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            {booking.matchPlayers?.filter(p => p.team === 2).map((p, idx) => (
                                              <div key={idx} style={{ fontSize: '12px', color: 'var(--text-main)' }}>• {p.name}</div>
                                            ))}
                                            {booking.matchPlayers?.filter(p => p.team === 2).length === 0 && (
                                              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>No players assigned</div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {booking.matchPlayers?.filter(p => !p.team).length > 0 && (
                                        <div style={{ marginTop: '10px', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'left' }}>
                                          Unassigned Match Players: {booking.matchPlayers.filter(p => !p.team).map(p => p.name).join(', ')}
                                        </div>
                                      )}
                                    </div>

                                    {/* SCOREBOARD DISPLAY */}
                                    {booking.scoreCard ? (
                                      <div style={{ background: 'rgba(0,0,0,0.15)', padding: '16px', borderRadius: '12px', border: '1.5px solid var(--border-glow)' }}>
                                        <div style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold', color: 'var(--accent-football)', marginBottom: '8px', borderBottom: '1px dashed var(--border-glow)', paddingBottom: '4px' }}>
                                          Live Scoreboard
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '6px 0' }}>
                                          <span style={{ fontWeight: 'bold' }}>{booking.scoreCard.team1}</span>
                                          <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--text-main)', fontSize: '15px' }}>
                                            {booking.scoreCard.score1} {booking.scoreCard.overs1 ? `(${booking.scoreCard.overs1} ov)` : ''}
                                          </span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '6px 0' }}>
                                          <span style={{ fontWeight: 'bold', color: 'var(--text-muted)' }}>{booking.scoreCard.team2}</span>
                                          <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--text-muted)', fontSize: '15px' }}>
                                            {booking.scoreCard.score2} {booking.scoreCard.overs2 ? `(${booking.scoreCard.overs2} ov)` : ''}
                                          </span>
                                        </div>
                                        <div style={{ marginTop: '12px', fontSize: '13px', fontWeight: 'bold', color: 'var(--accent-cricket)', textAlign: 'center', borderTop: '1px solid var(--border-glow)', paddingTop: '10px' }}>
                                          🏆 Result: {booking.scoreCard.result}
                                        </div>
                                      </div>
                                    ) : (
                                      <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', padding: '12px', background: 'rgba(0,0,0,0.15)', borderRadius: '8px' }}>
                                        No active scorecard. Scorecard will go live when match setup is initiated.
                                      </div>
                                    )}

                                    {/* CAPTAIN SCORECARD CONTROL */}
                                    {isCaptain && isCricket && (
                                      <button 
                                        className="btn-book-action" 
                                        style={{ 
                                          background: 'linear-gradient(135deg, var(--accent-cricket) 0%, #ff5252 100%)',
                                          color: '#000',
                                          fontWeight: '800',
                                          padding: '12px',
                                          fontSize: '13px',
                                          marginTop: '8px'
                                        }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setActiveScorecardBookingId(booking.id);
                                          // Decide which step to show based on current booking state
                                          if (!booking.scoreCard || booking.scoreCard.result === 'Match is scheduled') {
                                            setScorecardStep('splitter');
                                          } else if (!booking.scoreCard.tossWinner) {
                                            setScorecardStep('toss');
                                          } else if (!booking.scoreCard.striker) {
                                            setScorecardStep('setup');
                                          } else {
                                            setScorecardStep('scoring');
                                          }
                                        }}
                                      >
                                        Manage Live Match Scorecard (Split Teams, Toss, Score)
                                      </button>
                                    )}

                                  </div>
                                )
                              })()}

                              {/* Display Join Requests for Captain */}
                              {booking.openToJoin && booking.joinRequests && booking.joinRequests.length > 0 && (
                                <div style={{ marginTop: '12px', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
                                  <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold', color: 'orange', marginBottom: '8px' }}>
                                    Match Join Requests ({booking.joinRequests.length})
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {booking.joinRequests.map(req => (
                                      <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', background: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: '6px' }}>
                                        <div>
                                          <div style={{ fontWeight: 'bold' }}>{req.playerName}</div>
                                          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{req.email}</div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                          <button 
                                            className="btn-approve" 
                                            style={{ padding: '4px 10px', fontSize: '11px' }}
                                            onClick={(e) => { e.stopPropagation(); handleApproveJoinRequest(booking.id, req.id); }}
                                          >
                                            Approve
                                          </button>
                                          <button 
                                            className="btn-reject" 
                                            style={{ padding: '4px 10px', fontSize: '11px' }}
                                            onClick={(e) => { e.stopPropagation(); handleRejectJoinRequest(booking.id, req.id); }}
                                          >
                                            Reject
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}

                  {bookings.filter(b => b.captainName === currentUser.name || (currentUser.name && currentUser.name.includes('Rahul') && b.captainName && b.captainName.includes('Rahul'))).length === 0 && (
                    <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      No previous bookings found.
                    </div>
                  )}
                </div>
              </div>

              {/* Roster list of User Virtual Groups */}
              <div className="dashboard-matches-card">
                <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>
                  My Groups ({groups.filter(g => g.creator === currentUser.name || g.creator.includes('Rahul')).length})
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {groups.map(group => {
                    const canManage = currentUser.role === 'admin' || group.creator === currentUser.name || (currentUser.name && currentUser.name.includes('Rahul') && group.creator.includes('Rahul'))

                    return (
                      <div key={group.id} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glow)', borderRadius: '12px', padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glow)', paddingBottom: '8px', marginBottom: '12px' }}>
                          <div>
                            <h4 style={{ fontSize: '16px', fontWeight: '800' }}>{group.name}</h4>
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Created by {group.creator} on {group.createdWhen}</span>
                          </div>
                          <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--accent-football)', fontWeight: 'bold' }}>{group.sport}</span>
                        </div>

                        {/* Roster Listing */}
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'bold' }}>Group Roster:</span>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
                          {group.members.map((member, mIdx) => {
                            const isCreatorMember = member.name === group.creator || (group.creator.includes('Rahul') && member.name.includes('Rahul'))
                            return (
                              <div key={mIdx} style={{ background: 'rgba(0,0,0,0.2)', padding: '8px 10px', borderRadius: '6px', fontSize: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                  <div style={{ fontWeight: 'bold' }}>{member.name}</div>
                                  {member.isShadow ? (
                                    <div style={{ color: 'var(--accent-cricket)', fontSize: '10px', marginTop: '2px', display: 'flex', justifyContent: 'space-between' }}>
                                      <span>Offline</span>
                                      <span style={{ fontFamily: 'monospace' }}>Code: {member.claimCode}</span>
                                    </div>
                                  ) : (
                                    <div style={{ color: 'var(--text-muted)', fontSize: '10px', marginTop: '2px' }}>{member.email}</div>
                                  )}
                                </div>
                                {canManage && !isCreatorMember && (
                                  <button 
                                    style={{ background: 'transparent', border: 'none', color: 'var(--accent-cricket)', fontSize: '10px', cursor: 'pointer', padding: '2px 0', textDecoration: 'underline', marginTop: '6px', width: 'fit-content', alignSelf: 'flex-start' }}
                                    onClick={() => handleRemoveGroupMember(group.id, member.name)}
                                  >
                                    Remove Player
                                  </button>
                                )}
                              </div>
                            )
                          })}
                        </div>

                        {/* Management Controls */}
                        {canManage && (
                          <div style={{ marginTop: '16px', borderTop: '1px dashed var(--border-glow)', paddingTop: '12px' }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'bold' }}>Add Player to Group:</span>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                              <select 
                                className="role-selector" 
                                style={{ flex: 1, padding: '6px 10px', borderRadius: '6px' }}
                                onChange={(e) => {
                                  if (e.target.value) {
                                    handleAddGroupMember(group.id, e.target.value)
                                    e.target.value = '' // reset selection in UI
                                  }
                                }}
                                defaultValue=""
                              >
                                <option value="" disabled>Select player...</option>
                                {profiles
                                  .filter(p => !group.members.some(m => m.name === p.name || (p.email && m.email === p.email)))
                                  .map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                  ))
                                }
                              </select>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>
          </div>
        ) : !selectedSport ? (
          <div className="home-container">
            <section className="hero-section">
              <h1 className="hero-title">Welcome to Smash & Roast</h1>
              <p className="hero-subtitle">Select a sport to find venue availability, join matches, or edit live scorecards</p>
            </section>

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
                      </div>
                      <div 
                        className={`blueprint-turf-card ${selectedTurf === 1 ? 'active' : ''}`}
                        onClick={() => { setSelectedTurf(1); setSelectedHours([]); }}
                      >
                        <div className="blueprint-label">Turf 1 (Bottom)</div>
                        <div className="blueprint-sublabel">Clay Pitch</div>
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
                              btnStyle.color = '#fff'
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

                            return (
                              <button
                                key={slot.time}
                                className={`slot-btn ${btnClass} ${isSelected ? 'active' : ''}`}
                                onClick={() => handleSlotClick(slot)}
                                style={btnStyle}
                                disabled={isBooked && !bookingItem?.openToJoin}
                              >
                                <span className="slot-time">{slot.time}</span>
                                <span className="slot-status-badge">{statusText}</span>
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
                      <div style={{ background: 'rgba(0,0,0,0.15)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-glow)', marginBottom: '16px', textAlign: 'left' }}>
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

          const handleCoinFlip = () => {
            setTossCoinState({ spinning: true, winner: null, choice: null })
            setTimeout(() => {
              const randWinner = Math.random() < 0.5 ? 1 : 2 // 1 = Team A, 2 = Team B
              const choices = ['Batting', 'Bowling']
              const randChoice = choices[Math.floor(Math.random() * choices.length)]
              
              setTossCoinState({
                spinning: false,
                winner: randWinner,
                choice: randChoice
              })
            }, 2500)
          }

          const handleAcceptToss = () => {
            const team1Name = booking.teamName || 'Team A'
            const team2Name = 'Opponent Team'
            const t1 = tossCoinState.winner === 1 ? team1Name : team2Name
            const t2 = tossCoinState.winner === 1 ? team2Name : team1Name

            const isT1Batting = (tossCoinState.winner === 1 && tossCoinState.choice === 'Batting') || 
                                (tossCoinState.winner === 2 && tossCoinState.choice === 'Bowling')

            // Update scorecard team names and who is batting
            handleUpdateScorecard(booking.id, {
              team1: team1Name,
              team2: team2Name,
              tossWinner: tossCoinState.winner === 1 ? 'Team A' : 'Team B',
              tossChoice: tossCoinState.choice,
              battingTeam: isT1Batting ? 1 : 2
            })
            
            // Proceed to active player setup
            setScorecardStep('setup')
          }

          const handleSetupPlayers = (e) => {
            e.preventDefault()
            if (!batsmanStriker || !batsmanNonStriker || !currentBowler) {
              alert('Please select Striker, Non-Striker, and Bowler!')
              return
            }
            if (batsmanStriker === batsmanNonStriker) {
              alert('Striker and Non-Striker cannot be the same player!')
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
              ballsThisOver: []
            })

            setScorecardStep('scoring')
          }

          const handleRecordBall = (type, runs = 0) => {
            const sc = booking.scoreCard
            let newScore1 = sc.score1
            let newScore2 = sc.score2
            let currentInnings = sc.battingTeam

            // Parse current score: e.g. "45/2"
            let scoreStr = currentInnings === 1 ? newScore1 : newScore2
            let parts = scoreStr.split('/')
            let totalRuns = parseInt(parts[0], 10) || 0
            let totalWickets = parseInt(parts[1], 10) || 0

            // Parse overs: e.g. "5.4"
            let oversStr = currentInnings === 1 ? sc.overs1 : sc.overs2
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
              
              if (totalWickets >= 10) {
                alert('All out! Innings ended.')
              }
            } else if (type === 'runs_wicket') {
              totalRuns += runs
              totalWickets += 1
              strikerRunsInc = runs
              strikerBallsInc = 1
              bowlerBallsInc = 1
              bowlerRunsInc = runs
              ballLabel = `${runs}+W`
            }

            // Update overs and balls count
            if (isLegalBall) {
              ballsInOver += 1
              if (ballsInOver >= 6) {
                completedOvers += 1
                ballsInOver = 0
                alert('Over completed! Change the bowler.')
              }
            }

            const updatedOvers = `${completedOvers}.${ballsInOver}`
            const updatedScore = `${totalRuns}/${totalWickets}`

            const newBallsThisOver = [...(sc.ballsThisOver || []), ballLabel]

            // Swap batsmen if odd runs scored on a legal ball (or wide/no ball if applicable)
            let swap = false
            if (type === 'run' && runs % 2 !== 0) {
              swap = true
            }

            const nextStriker = swap ? sc.nonStriker : sc.striker
            const nextNonStriker = swap ? sc.striker : sc.nonStriker

            handleUpdateScorecard(booking.id, {
              score1: currentInnings === 1 ? updatedScore : sc.score1,
              overs1: currentInnings === 1 ? updatedOvers : sc.overs1,
              score2: currentInnings === 2 ? updatedScore : sc.score2,
              overs2: currentInnings === 2 ? updatedOvers : sc.overs2,
              striker: type === 'wicket' ? '' : nextStriker, // Reset striker on wicket to prompt selection
              nonStriker: nextNonStriker,
              strikerRuns: (sc.strikerRuns || 0) + strikerRunsInc,
              strikerBalls: (sc.strikerBalls || 0) + strikerBallsInc,
              nonStrikerRuns: swap ? (sc.strikerRuns || 0) + strikerRunsInc : (sc.nonStrikerRuns || 0),
              nonStrikerBalls: swap ? (sc.strikerBalls || 0) + strikerBallsInc : (sc.nonStrikerBalls || 0),
              bowlerRuns: (sc.bowlerRuns || 0) + bowlerRunsInc,
              bowlerBalls: (sc.bowlerBalls || 0) + bowlerBallsInc,
              bowlerWickets: (sc.bowlerWickets || 0) + bowlerWicketsInc,
              ballsThisOver: newBallsThisOver,
              result: `In progress: ${currentInnings === 1 ? (booking.scoreCard?.team1 || 'Team A') : (booking.scoreCard?.team2 || 'Team B')} batting`
            })

            // If wicket fell, prompt striker selection
            if (type === 'wicket') {
              setBatsmanStriker('')
            }
          }

          const handleChooseNewStriker = (name) => {
            setBatsmanStriker(name)
            handleUpdateScorecard(booking.id, {
              striker: name,
              strikerRuns: 0,
              strikerBalls: 0
            })
          }

          const handleOverCompleteReset = () => {
            handleUpdateScorecard(booking.id, {
              ballsThisOver: [],
              bowler: '',
              bowlerBalls: 0,
              bowlerRuns: 0,
              bowlerWickets: 0
            })
            setCurrentBowler('')
          }

          const handleDeclareInnings = () => {
            const sc = booking.scoreCard
            if (sc.battingTeam === 1) {
              alert('First innings declared! Swapping batting team.')
              handleUpdateScorecard(booking.id, {
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
              // Compare scores
              const runs1 = parseInt(sc.score1.split('/')[0], 10) || 0
              const runs2 = parseInt(sc.score2.split('/')[0], 10) || 0
              let resultText = ''
              if (runs1 > runs2) {
                resultText = `${sc.team1} won by ${runs1 - runs2} runs`
              } else if (runs2 > runs1) {
                resultText = `${sc.team2} won by ${10 - (parseInt(sc.score2.split('/')[1], 10) || 0)} wickets`
              } else {
                resultText = 'Match tied!'
              }
              alert(`Match ended! ${resultText}`)
              handleUpdateScorecard(booking.id, {
                result: resultText,
                isCompleted: true
              })
              // Also update status of booking
              setBookings(prev => prev.map(b => {
                if (b.id === booking.id) {
                  return { ...b, status: 'completed' }
                }
                return b
              }))
              setActiveScorecardBookingId(null)
            }
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
                    <h2 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--accent-cricket)' }}>Cricket Live Scorecard Manager</h2>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Match ID: {booking.id} • Turf {booking.turfId}</span>
                  </div>
                  <button 
                    className="btn-login" 
                    style={{ borderColor: 'var(--accent-cricket)', color: 'var(--accent-cricket)', padding: '6px 16px' }}
                    onClick={() => setActiveScorecardBookingId(null)}
                  >
                    Close & Exit
                  </button>
                </div>

                {/* STEP 1: TEAM SPLITTER (DRAG & DROP) */}
                {scorecardStep === 'splitter' && (
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Step 1: Split Match Roster into Team A & Team B</h3>
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
                              <button style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-muted)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer' }} onClick={() => handleAssignMatchPlayerTeam(booking.id, p.name, null)}>Remove</button>
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
                              <button style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-muted)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer' }} onClick={() => handleAssignMatchPlayerTeam(booking.id, p.name, null)}>Remove</button>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>

                    <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                      <button 
                        className="btn-book-action"
                        style={{ width: 'auto', padding: '12px 30px' }}
                        disabled={teamAPlayers.length === 0 || teamBPlayers.length === 0}
                        onClick={handleStartToss}
                      >
                        Confirm Roster & Proceed to Toss
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: COIN TOSS SCREEN */}
                {scorecardStep === 'toss' && (
                  <div className="toss-coin-view">
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Step 2: Toss the Coin</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Flip the coin to determine who gets to choose to bat or bowl first.
                    </p>

                    {/* Virtual Coin Spinner */}
                    <div className="coin-container">
                      <div className={`coin ${tossCoinState.spinning ? (Math.random() < 0.5 ? 'spinning-heads' : 'spinning-tails') : ''}`}>
                        <div className="side heads">Heads</div>
                        <div className="side tails">Tails</div>
                      </div>
                    </div>

                    {tossCoinState.winner ? (
                      <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--accent-football)' }}>
                          {tossCoinState.winner === 1 ? 'Team A' : 'Team B'} won the toss!
                        </h4>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          They have decided to <strong>{tossCoinState.choice}</strong> first.
                        </p>
                        
                        <button 
                          className="btn-book-action" 
                          style={{ width: 'auto', padding: '12px 30px', marginTop: '20px' }}
                          onClick={handleAcceptToss}
                        >
                          Accept Toss & Proceed to Player Setup
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="btn-book-action" 
                        style={{ width: 'auto', padding: '12px 30px', marginTop: '20px' }}
                        disabled={tossCoinState.spinning}
                        onClick={handleCoinFlip}
                      >
                        {tossCoinState.spinning ? 'Flipping Coin...' : 'Toss Coin'}
                      </button>
                    )}
                  </div>
                )}

                {/* STEP 3: SETUP ACTIVE PLAYERS */}
                {scorecardStep === 'setup' && (
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Step 3: Setup Active Batsmen & Bowler</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                      Select the opening batsmen (Striker and Non-Striker) from the Batting team, and the opening bowler from the Bowling team.
                    </p>

                    <form onSubmit={handleSetupPlayers} style={{ background: 'rgba(0,0,0,0.15)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-glow)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
                            {battingPlayersList.map(p => (
                              <option key={p.name} value={p.name}>{p.name}</option>
                            ))}
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
                            {battingPlayersList.map(p => (
                              <option key={p.name} value={p.name}>{p.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div style={{ maxWidth: '400px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                          Active Bowler (Bowling Team)
                        </label>
                        <select 
                          className="role-selector" 
                          style={{ width: '100%', padding: '10px' }} 
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
                  const isBattingTeam1 = sc.battingTeam === 1
                  const currentInningsScore = isBattingTeam1 ? sc.score1 : sc.score2
                  const currentInningsOvers = isBattingTeam1 ? sc.overs1 : sc.overs2

                  return (
                    <div>
                      {/* Innings Live Dashboard */}
                      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-glow)', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
                        <div>
                          <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold', color: 'var(--accent-football)' }}>
                            Active Innings: {sc.battingTeam === 1 ? sc.team1 : sc.team2} is Batting
                          </span>
                          <h1 style={{ fontSize: '48px', fontWeight: '900', color: '#fff', fontFamily: 'monospace', margin: '8px 0' }}>
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
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                        
                        {/* Batsmen stats */}
                        <div style={{ background: 'rgba(0,0,0,0.15)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glow)' }}>
                          <div style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--accent-football)', fontWeight: 'bold', borderBottom: '1px solid var(--border-glow)', paddingBottom: '6px', marginBottom: '10px' }}>
                            Batsmen Stats
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 'bold' }}>
                              <span>🏏 Striker: {sc.striker || <span style={{ color: 'var(--accent-cricket)', fontStyle: 'italic' }}>Out - Select Next</span>}</span>
                              <span style={{ fontFamily: 'monospace' }}>{sc.striker ? `${sc.strikerRuns || 0} (${sc.strikerBalls || 0})` : '-'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)' }}>
                              <span>🏏 Non-Striker: {sc.nonStriker}</span>
                              <span style={{ fontFamily: 'monospace' }}>{sc.nonStrikerRuns || 0} ({sc.nonStrikerBalls || 0})</span>
                            </div>
                          </div>
                        </div>

                        {/* Bowler stats */}
                        <div style={{ background: 'rgba(0,0,0,0.15)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glow)' }}>
                          <div style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--accent-cricket)', fontWeight: 'bold', borderBottom: '1px solid var(--border-glow)', paddingBottom: '6px', marginBottom: '10px' }}>
                            Bowler Stats
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 'bold' }}>
                            <span>🏃 Bowler: {sc.bowler || <span style={{ color: 'var(--accent-cricket)', fontStyle: 'italic' }}>Select Bowler</span>}</span>
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
                            {battingPlayersList
                              .filter(p => p.name !== sc.nonStriker)
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

                      {/* BALL INPUT BUTTONS PANEL */}
                      <div style={{ background: 'rgba(0,0,0,0.15)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-glow)' }}>
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
                          <button className="btn-score-circle" disabled={!sc.striker || !sc.bowler} onClick={() => {
                            const extraRuns = parseInt(prompt("Enter runs ran on wide ball:", "1"), 10) || 1
                            handleRecordBall('wide', extraRuns)
                          }}>Wd + Runs</button>
                          <button className="btn-score-circle" disabled={!sc.striker || !sc.bowler} onClick={() => {
                            const extraRuns = parseInt(prompt("Enter runs ran on no ball:", "1"), 10) || 1
                            handleRecordBall('no_ball', extraRuns)
                          }}>Nb + Runs</button>
                          <button className="btn-score-circle wicket" disabled={!sc.striker || !sc.bowler} onClick={() => {
                            const runsRan = parseInt(prompt("Enter runs completed before run-out wicket:", "1"), 10) || 1
                            handleRecordBall('runs_wicket', runsRan)
                          }}>Runs + Wkt</button>
                        </div>
                      </div>

                      {/* Current over display */}
                      <div style={{ marginTop: '24px', textAlign: 'left' }}>
                        <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-muted)' }}>Balls in Over:</h4>
                        <div className="over-balls-list">
                          {sc.ballsThisOver?.map((ball, bIdx) => {
                            let extraClass = ''
                            if (ball.includes('W')) extraClass = 'wicket-ball'
                            else if (ball === '4') extraClass = 'boundary-4'
                            else if (ball === '6') extraClass = 'boundary-6'

                            return (
                              <span key={bIdx} className={`over-ball-tag ${extraClass}`}>{ball}</span>
                            )
                          })}
                          {(!sc.ballsThisOver || sc.ballsThisOver.length === 0) && (
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>No balls bowled in this over yet.</span>
                          )}
                        </div>
                      </div>

                      {/* End of Over trigger */}
                      {sc.ballsThisOver?.filter(b => !b.includes('Wd') && !b.includes('Nb')).length >= 6 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid var(--accent-others)', padding: '16px', borderRadius: '12px', marginTop: '24px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 'bold' }}>This over is complete! Reset bowler state to start the next over:</span>
                          <button 
                            className="btn-login" 
                            style={{ borderColor: 'var(--accent-others)', color: 'var(--accent-others)' }}
                            onClick={handleOverCompleteReset}
                          >
                            Prepare Next Over
                          </button>
                        </div>
                      )}

                      {/* Innings & Match Actions */}
                      <div style={{ marginTop: '32px', display: 'flex', gap: '12px', borderTop: '1px solid var(--border-glow)', paddingTop: '20px' }}>
                        <button 
                          className="btn-book-action" 
                          style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glow)', color: '#fff' }}
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

                    </div>
                  )
                })()}

              </div>
            </div>
          )
        })()}
          </div>
        )}

      </main>
    </>
  )
}

export default App
