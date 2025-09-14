import React, { useState, useEffect } from 'react';
import {
	NotebookPen,
	Save,
	CheckCircle,
	Search,
	Calendar,
	X,
	Filter,
} from 'lucide-react';
import styles from './DiaryEntries.module.css';

const DiaryEntries = () => {
	// State for new entry
	const [newEntry, setNewEntry] = useState('');
	const [isSaved, setIsSaved] = useState(false);
	const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

	// State for search and filters
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedDate, setSelectedDate] = useState('');
	const [showFilters, setShowFilters] = useState(false);

	// Mock data - in real app, this would come from props or context
	const [diaryEntries, setDiaryEntries] = useState([
		{
			id: 1,
			content:
				'Had a good morning walk today. Tremor was minimal and I felt more energetic than usual. The new medication timing seems to be working better.',
			date: '2024-09-14T10:30:00',
			source: 'journey',
			goalName: null,
		},
		{
			id: 2,
			content:
				'Feeling a bit stiff this morning. Balance was okay during my physical therapy exercises. Need to remember to take medication with food.',
			date: '2024-09-13T14:15:00',
			source: 'tracking',
			goalName: 'Physical activity',
		},
		{
			id: 3,
			content:
				'Great day overall! Managed to complete my gardening hobby session without too much fatigue. Really enjoying this new routine.',
			date: '2024-09-12T16:45:00',
			source: 'tracking',
			goalName: 'Hobbies',
		},
		{
			id: 4,
			content:
				'Sleep was better last night after implementing the new bedtime routine. Woke up feeling more refreshed.',
			date: '2024-09-11T08:20:00',
			source: 'journey',
			goalName: null,
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

	// Reset saved state when user starts typing again
	useEffect(() => {
		if (newEntry) {
			setIsSaved(false);
			setShowSaveConfirmation(false);
		}
	}, [newEntry]);

	// Filter entries based on search and date
	const filteredEntries = diaryEntries.filter((entry) => {
		const matchesSearch = entry.content
			.toLowerCase()
			.includes(searchTerm.toLowerCase());
		const entryDate = new Date(entry.date).toISOString().split('T')[0];
		const matchesDate = !selectedDate || entryDate === selectedDate;
		return matchesSearch && matchesDate;
	});

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

	// Clear filters
	const clearFilters = () => {
		setSearchTerm('');
		setSelectedDate('');
	};

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

			{/* Search and Filter Section */}
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
					</button>
				</div>

				{/* Filter Panel */}
				{showFilters && (
					<div className={styles.filterPanel}>
						<div className={styles.filterGroup}>
							<label className={styles.filterLabel}>
								<Calendar size={16} />
								Filter by Date
							</label>
							<input
								type='date'
								value={selectedDate}
								onChange={(e) => setSelectedDate(e.target.value)}
								className={styles.dateInput}
							/>
						</div>

						{(searchTerm || selectedDate) && (
							<button
								className={styles.clearFiltersButton}
								onClick={clearFilters}
							>
								<X size={16} />
								Clear Filters
							</button>
						)}
					</div>
				)}
			</div>

			{/* Entries History */}
			<div className={styles.entriesHistory}>
				<h4 className={styles.historyTitle}>
					Your Diary Entries ({filteredEntries.length})
				</h4>

				{filteredEntries.length === 0 ? (
					<div className={styles.emptyState}>
						<NotebookPen className={styles.emptyIcon} size={48} />
						<p className={styles.emptyText}>
							{searchTerm || selectedDate
								? 'No entries found matching your search criteria.'
								: 'No diary entries yet. Start writing your first entry above!'}
						</p>
					</div>
				) : (
					<div className={styles.entriesList}>
						{filteredEntries.map((entry) => (
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
