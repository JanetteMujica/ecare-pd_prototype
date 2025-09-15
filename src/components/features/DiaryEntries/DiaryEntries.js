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

	// Enhanced mock data with bookmarks
	const [diaryEntries, setDiaryEntries] = useState([
		{
			id: 1,
			content:
				'Had a good morning walk today. Tremor was minimal and I felt more energetic than usual. The new medication timing seems to be working better.',
			date: '2024-09-14T10:30:00',
			source: 'journey',
			goalName: null,
			isBookmarked: true,
		},
		{
			id: 2,
			content:
				'Feeling a bit stiff this morning. Balance was okay during my physical therapy exercises. Need to remember to take medication with food.',
			date: '2024-09-13T14:15:00',
			source: 'tracking',
			goalName: 'Physical activity',
			isBookmarked: false,
		},
		{
			id: 3,
			content:
				'Great day overall! Managed to complete my gardening hobby session without too much fatigue. Really enjoying this new routine.',
			date: '2024-09-12T16:45:00',
			source: 'tracking',
			goalName: 'Hobbies',
			isBookmarked: true,
		},
		{
			id: 4,
			content:
				'Sleep was better last night after implementing the new bedtime routine. Woke up feeling more refreshed.',
			date: '2024-09-11T08:20:00',
			source: 'journey',
			goalName: null,
			isBookmarked: false,
		},
		{
			id: 5,
			content:
				'Challenging day with medication side effects. Doctor appointment scheduled for next week to discuss adjustments.',
			date: '2024-09-10T16:30:00',
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
						placeholder="How are you feeling today? Any thoughts, challenges, or successes you'd like to note..."
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
