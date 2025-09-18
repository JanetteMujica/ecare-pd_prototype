import React, { useState, useEffect } from 'react';
import {
	NotebookPen,
	Save,
	CheckCircle,
	Search,
	Calendar,
	X,
	Filter,
	Bookmark,
	BookmarkCheck,
	ArrowUpDown,
	CalendarRange,
	Star,
} from 'lucide-react';
import styles from './DiaryEntries.module.css';

const DiaryEntries = () => {
	// State for new entry
	const [newEntry, setNewEntry] = useState('');
	const [isSaved, setIsSaved] = useState(false);
	const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

	// Enhanced search and filter state
	const [searchTerm, setSearchTerm] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [sortOrder, setSortOrder] = useState('newest'); // 'newest', 'oldest'
	const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
	const [showFilters, setShowFilters] = useState(false);

	// Allison's diary entries - reflecting her story as a recently diagnosed teacher
	const [diaryEntries, setDiaryEntries] = useState([
		{
			id: 1,
			content:
				'First week back to school since diagnosis. The kids are as energetic as ever! I noticed my fatigue hits hardest around 2 PM, right when Grade 3 has their math lesson. Made a note to take my afternoon Levodopa dose 30 minutes earlier tomorrow. The new medication schedule is helping, but I still feel that afternoon dip. At least my morning tremor was barely noticeable during circle time.',
			date: '2024-09-16T16:30:00',
			source: 'journey',
			goalName: null,
			isBookmarked: true,
		},
		{
			id: 2,
			content:
				"Sleep was terrible again - only got about 5 hours. Woke up at 3 AM and couldn't get back to sleep. The constipation is getting worse too, even with the extra fiber I've been adding to breakfast. Called Dr. Martinez's office to discuss adjusting my evening dose timing. Maybe taking it earlier will help with the sleep issues. Planning to try that chamomile tea my colleague Sarah recommended.",
			date: '2024-09-15T07:45:00',
			source: 'tracking',
			goalName: 'Sleep improvement',
			isBookmarked: true,
		},
		{
			id: 3,
			content:
				"Had coffee with my son Jake today. He's worried about me but trying not to show it. I assured him that I'm managing well and that the medication is helping. We walked around the Rideau Centre for about an hour - felt good to get some exercise. My balance felt steady, and we even laughed about how I'm walking slower than the elderly mall walkers now. Small victories!",
			date: '2024-09-14T14:20:00',
			source: 'journey',
			goalName: null,
			isBookmarked: false,
		},
		{
			id: 4,
			content:
				"Tried the new exercise routine from my physiotherapist. 20 minutes of gentle movements and balance exercises. The fatigue wasn't as overwhelming afterward as I expected. Actually felt more energized for the rest of the evening. Setting a goal to do this 3 times a week. My handwriting is still shaky during lesson planning, but I'm getting better at typing up my notes instead.",
			date: '2024-09-13T18:15:00',
			source: 'tracking',
			goalName: 'Regular exercise',
			isBookmarked: true,
		},
		{
			id: 5,
			content:
				'Rough day with medication timing. Forgot my noon dose because of parent-teacher conferences running late. By 3 PM, the stiffness in my left hand was noticeable - had trouble writing on the whiteboard. One parent asked if I was okay. I just said I had a minor injury. Not ready to discuss the diagnosis with parents yet. Need to set phone reminders for medication times.',
			date: '2024-09-12T17:00:00',
			source: 'tracking',
			goalName: 'Medication routine',
			isBookmarked: true,
		},
		{
			id: 6,
			content:
				"Beautiful autumn day in Ottawa! The leaves are just starting to change. Took a short walk through Major's Hill Park during lunch break. The fresh air helped with the afternoon fatigue. I've been reading about how important vitamin D is for people with Parkinson's, so I'm trying to get more sunlight. The principal noticed I seemed more energetic during our staff meeting afterward.",
			date: '2024-09-11T13:30:00',
			source: 'journey',
			goalName: null,
			isBookmarked: false,
		},
		{
			id: 7,
			content:
				"Weekend experiment: took my evening medication 2 hours earlier. Slept for 6 hours straight! First time in weeks. Woke up feeling more rested, though still tired. The constipation is still an issue - adding prunes to my morning routine. Jake is coming for dinner on Sunday, so I want to meal prep something healthy that won't interact with my medication.",
			date: '2024-09-10T08:00:00',
			source: 'tracking',
			goalName: 'Sleep improvement',
			isBookmarked: true,
		},
		{
			id: 8,
			content:
				"One year since my diagnosis. It's been a journey of learning and adapting. Some days are harder than others, but I'm grateful for my supportive colleagues, my wonderful students who keep me motivated, and the healthcare team helping me manage this. The medication side effects are challenging, but I'm getting better at recognizing patterns and adjusting my routine accordingly.",
			date: '2024-09-09T20:45:00',
			source: 'journey',
			goalName: null,
			isBookmarked: true,
		},
	]);

	// Handle saving new entry
	const handleSave = () => {
		if (newEntry.trim()) {
			const newDiaryEntry = {
				id: Date.now(),
				content: newEntry.trim(),
				date: new Date().toISOString(),
				source: 'journey',
				goalName: null,
				isBookmarked: false,
			};

			setDiaryEntries((prev) => [newDiaryEntry, ...prev]);
			setNewEntry('');
			setIsSaved(true);
			setShowSaveConfirmation(true);

			// Hide confirmation after 3 seconds
			setTimeout(() => {
				setShowSaveConfirmation(false);
			}, 3000);
		}
	};

	// Handle bookmark toggle
	const toggleBookmark = (entryId) => {
		setDiaryEntries((prev) =>
			prev.map((entry) =>
				entry.id === entryId
					? { ...entry, isBookmarked: !entry.isBookmarked }
					: entry
			)
		);
	};

	// Reset saved state when user starts typing again
	useEffect(() => {
		if (newEntry) {
			setIsSaved(false);
			setShowSaveConfirmation(false);
		}
	}, [newEntry]);

	// Enhanced filtering and sorting logic
	const filteredAndSortedEntries = React.useMemo(() => {
		let filtered = diaryEntries.filter((entry) => {
			// Text search filter
			const matchesSearch = entry.content
				.toLowerCase()
				.includes(searchTerm.toLowerCase());

			// Date range filter
			const entryDate = new Date(entry.date);
			const startDateObj = startDate ? new Date(startDate) : null;
			const endDateObj = endDate ? new Date(endDate + 'T23:59:59') : null;

			const matchesDateRange =
				(!startDateObj || entryDate >= startDateObj) &&
				(!endDateObj || entryDate <= endDateObj);

			// Bookmark filter
			const matchesBookmark = !showBookmarkedOnly || entry.isBookmarked;

			return matchesSearch && matchesDateRange && matchesBookmark;
		});

		// Sort entries
		filtered.sort((a, b) => {
			const dateA = new Date(a.date);
			const dateB = new Date(b.date);
			return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
		});

		return filtered;
	}, [
		diaryEntries,
		searchTerm,
		startDate,
		endDate,
		sortOrder,
		showBookmarkedOnly,
	]);

	// Format date for display
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	// Clear all filters
	const clearFilters = () => {
		setSearchTerm('');
		setStartDate('');
		setEndDate('');
		setSortOrder('newest');
		setShowBookmarkedOnly(false);
	};

	// Check if any filters are active
	const hasActiveFilters =
		searchTerm ||
		startDate ||
		endDate ||
		showBookmarkedOnly ||
		sortOrder !== 'newest';

	// Get bookmarked count
	const bookmarkedCount = diaryEntries.filter(
		(entry) => entry.isBookmarked
	).length;

	return (
		<div className={styles.diaryContainer}>
			{/* New Entry Section */}
			<div className={styles.newEntryCard}>
				<h4 className={styles.newEntryTitle}>Write New Entry</h4>
				<div className={styles.entryForm}>
					<textarea
						className={styles.entryTextarea}
						value={newEntry}
						onChange={(e) => setNewEntry(e.target.value)}
						placeholder="How are you feeling today? How did teaching go? Any thoughts about medication, sleep, or managing symptoms you'd like to note..."
						rows={4}
					/>

					{/* Save Section */}
					<div className={styles.saveSection}>
						<button
							className={`${styles.saveButton} ${
								!newEntry.trim() ? styles.saveButtonDisabled : ''
							}`}
							onClick={handleSave}
							disabled={!newEntry.trim()}
						>
							{isSaved ? (
								<>
									<CheckCircle size={20} />
									Saved
								</>
							) : (
								<>
									<Save size={20} />
									Save Entry
								</>
							)}
						</button>

						{/* Save Confirmation */}
						{showSaveConfirmation && (
							<div className={styles.saveConfirmation}>
								<CheckCircle size={16} />
								Your diary entry has been saved successfully!
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Enhanced Search and Filter Section */}
			<div className={styles.searchSection}>
				<div className={styles.searchControls}>
					<div className={styles.searchInput}>
						<Search className={styles.searchIcon} size={20} />
						<input
							type='text'
							placeholder='Search entries by keywords...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className={styles.searchField}
						/>
					</div>

					<button
						className={`${styles.filterButton} ${
							showFilters ? styles.filterButtonActive : ''
						}`}
						onClick={() => setShowFilters(!showFilters)}
					>
						<Filter size={20} />
						Filters
						{hasActiveFilters && <span className={styles.filterBadge}></span>}
					</button>
				</div>

				{/* Enhanced Filter Panel */}
				{showFilters && (
					<div className={styles.filterPanel}>
						{/* Date Range Filters */}
						<div className={styles.filterRow}>
							<div className={styles.filterGroup}>
								<label className={styles.filterLabel}>
									<CalendarRange size={16} />
									Date Range
								</label>
								<div className={styles.dateRangeInputs}>
									<div className={styles.dateInputGroup}>
										<label className={styles.dateLabel}>From:</label>
										<input
											type='date'
											value={startDate}
											onChange={(e) => setStartDate(e.target.value)}
											className={styles.dateInput}
										/>
									</div>
									<div className={styles.dateInputGroup}>
										<label className={styles.dateLabel}>To:</label>
										<input
											type='date'
											value={endDate}
											onChange={(e) => setEndDate(e.target.value)}
											className={styles.dateInput}
										/>
									</div>
								</div>
							</div>

							{/* Sort Order */}
							<div className={styles.filterGroup}>
								<label className={styles.filterLabel}>
									<ArrowUpDown size={16} />
									Sort Order
								</label>
								<select
									value={sortOrder}
									onChange={(e) => setSortOrder(e.target.value)}
									className={styles.sortSelect}
								>
									<option value='newest'>Newest First</option>
									<option value='oldest'>Oldest First</option>
								</select>
							</div>
						</div>

						{/* Bookmark Filter */}
						<div className={styles.filterRow}>
							<div className={styles.filterGroup}>
								<label className={styles.filterLabel}>
									<Star size={16} />
									Bookmarked Entries
								</label>
								<div className={styles.bookmarkToggle}>
									<button
										className={`${styles.bookmarkFilterButton} ${
											showBookmarkedOnly ? styles.bookmarkFilterActive : ''
										}`}
										onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
									>
										<Bookmark size={16} />
										Show Bookmarked Only ({bookmarkedCount})
									</button>
								</div>
							</div>
						</div>

						{/* Clear Filters */}
						{hasActiveFilters && (
							<div className={styles.filterActions}>
								<button
									className={styles.clearFiltersButton}
									onClick={clearFilters}
								>
									<X size={16} />
									Clear All Filters
								</button>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Entries History */}
			<div className={styles.entriesHistory}>
				<h4 className={styles.historyTitle}>
					Your Diary Entries ({filteredAndSortedEntries.length})
					{showBookmarkedOnly && (
						<span className={styles.bookmarkedIndicator}>
							<Bookmark size={16} />
							Bookmarked Only
						</span>
					)}
				</h4>

				{filteredAndSortedEntries.length === 0 ? (
					<div className={styles.emptyState}>
						<NotebookPen className={styles.emptyIcon} size={48} />
						<p className={styles.emptyText}>
							{hasActiveFilters
								? 'No entries found matching your search criteria.'
								: 'No diary entries yet. Start writing your first entry above!'}
						</p>
						{hasActiveFilters && (
							<button
								className={styles.clearFiltersButton}
								onClick={clearFilters}
							>
								<X size={16} />
								Clear Filters
							</button>
						)}
					</div>
				) : (
					<div className={styles.entriesList}>
						{filteredAndSortedEntries.map((entry) => (
							<div key={entry.id} className={styles.entryCard}>
								<div className={styles.entryHeader}>
									<div className={styles.entryMeta}>
										<span className={styles.entryDate}>
											{formatDate(entry.date)}
										</span>
										<span
											className={`${styles.entrySource} ${
												entry.source === 'tracking'
													? styles.entrySourceTracking
													: styles.entrySourceJourney
											}`}
										>
											{entry.source === 'tracking' ? 'From Tracking' : 'Diary'}
										</span>
										{entry.goalName && (
											<span className={styles.goalBadge}>{entry.goalName}</span>
										)}
									</div>
									<button
										className={`${styles.bookmarkButton} ${
											entry.isBookmarked ? styles.bookmarkButtonActive : ''
										}`}
										onClick={() => toggleBookmark(entry.id)}
										title={
											entry.isBookmarked ? 'Remove bookmark' : 'Add bookmark'
										}
									>
										{entry.isBookmarked ? (
											<BookmarkCheck size={20} />
										) : (
											<Bookmark size={20} />
										)}
									</button>
								</div>
								<div className={styles.entryContent}>
									<p>{entry.content}</p>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default DiaryEntries;
