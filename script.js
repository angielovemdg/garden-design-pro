class GardenDesignTool {
    constructor() {
        this.canvas = document.getElementById('drawingCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.elements = [];
        this.currentTool = 'select';
        this.isDrawing = false;
        this.currentPath = [];
        this.scale = 1;
        this.scaleSet = false;
        this.scalePoints = [];
        this.scalingMode = false;
        this.selectedElement = null;
        this.backgroundImage = null;
        this.zoom = 1;
        this.panX = 0;
        this.panY = 0;
        this.isPanning = false;
        this.lastPanPoint = null;
        this.undoStack = [];
        this.redoStack = [];
        this.maxUndoSteps = 20;
        this.editMode = false;
        this.draggedPoint = null;
        this.draggedElement = null;
        this.showMeasurements = true;
        this.editPoints = [];
        this.handMode = false;
        this.rulerMode = false;
        this.rulerPoints = [];
        this.rulerLines = [];
        this.scaleInputMode = false;
        this.subtractMode = false;
        this.eraserMode = false;
        this.deductMode = false;
        this.pdfDocument = null;
        this.currentPdfPage = 0;
        this.selectedState = 'QLD';
        this.stateRates = {};
        
        // Preset configurations with improved defaults
        this.presetConfigs = {
            pergola: { width: 3, height: 4, price: 2500, description: 'Timber structure pergola' },
            pool: { width: 8, height: 4, price: 35000, description: 'Fiberglass swimming pool' },
            spa: { width: 2, height: 2, price: 8500, description: 'Hot tub spa' }
        };

        // Tree and shrub configurations
        this.treeConfigs = {
            'Small Tree': { diameter: 2, price: 150, description: 'Small ornamental tree' },
            'Medium Tree': { diameter: 4, price: 300, description: 'Medium shade tree' },
            'Large Tree': { diameter: 6, price: 500, description: 'Large feature tree' },
            'Palm Tree': { diameter: 3, price: 400, description: 'Palm tree' },
            'Fruit Tree': { diameter: 3, price: 250, description: 'Fruit bearing tree' }
        };

        this.shrubConfigs = {
            'Shrub-140mm pot': { diameter: 0.14, price: 35, description: 'Supply & install Shrub-140mm pot' },
            'Shrub-200mm pot': { diameter: 0.2, price: 45, description: 'Supply & install Shrub-200mm pot' },
            'Shrub-250mm pot': { diameter: 0.25, price: 55, description: 'Supply & install Shrub-250mm pot' },
            'Shrub-300mm pot': { diameter: 0.3, price: 90, description: 'Supply & install Shrub-300mm pot' },
            'Shrub-400mm pot': { diameter: 0.4, price: 180, description: 'Supply & install Shrub-400mm pot' }
        };

        // Enhanced element subtypes with QLD default rates and modern colors
        this.elementSubtypes = {
            'driveway-concrete': {
                'Exposed Aggregate': { rate: 95, description: 'Exposed aggregate concrete', color: '#6366f1' },
                'Plain Concrete': { rate: 75, description: 'Plain concrete', color: '#8b5cf6' },
                'Patterned Concrete': { rate: 120, description: 'Stamped pattern concrete', color: '#a855f7' }
            },
            'plain-concrete': {
                'Standard Concrete': { rate: 75, description: 'Basic concrete slab', color: '#8b5cf6' },
                'Plain Concrete': { rate: 95, description: 'Plain concrete', color: '#6366f1' }
            },
            'paving': {
                'Brick Paving': { rate: 120, description: 'Clay brick pavers', color: '#dc2626' },
                'Natural Stone Paving': { rate: 280, description: 'Natural stone pavers', color: '#b91c1c' },
                'Concrete Paver': { rate: 240, description: 'Concrete paver', color: '#991b1b' },
                'Porcelain Pavers': { rate: 260, description: 'Porcelain pavers on 100mm concrete slab', color: '#7f1d1d' },
                'Crazy Paving': { rate: 330, description: 'Crazy paving on 100mm concrete slab', color: '#450a0a' }
            },
            'decking': {
                'Hardwood': { rate: 180, description: 'Premium hardwood decking', color: '#92400e' },
                'Composite': { rate: 220, description: 'Low maintenance composite', color: '#78350f' }
            },
            'garden-beds': {
                'Garden Soil with Mulch': { rate: 35, description: 'Garden soil with mulch', color: '#16a34a' },
                'Garden Beds - Basic': { rate: 65, description: 'Garden beds with plants-Basic', color: '#15803d' },
                'Garden Beds - Premium': { rate: 95, description: 'Garden beds with plants-Premium', color: '#166534' },
                'Decorative Rock/Gravels': { rate: 85, description: 'Decorative rock/gravels', color: '#14532d' },
                'Raised Beds': { rate: 120, description: 'Timber raised garden beds', color: '#052e16' }
            },
            'lawn': {
                'Turf Installation': { rate: 25, description: 'Instant turf installation', color: '#22c55e' },
                'Seed & Prep': { rate: 15, description: 'Lawn seeding and preparation', color: '#16a34a' },
                'Artificial Grass': { rate: 85, description: 'Synthetic grass installation', color: '#15803d' }
            },
            'shed': {
                'Colorbond Shed': { rate: 2800, description: 'Colorbond shed', color: '#92400e' },
                'Custom Shed': { rate: 4000, description: 'Custom designed shed', color: '#451a03' }
            },
            'fence-boundary': {
                'Colorbond Steel Fence': { rate: 85, description: 'Colorbond steel fence', color: '#4b5563' },
                'Timber Fence': { rate: 75, description: 'Timber fence', color: '#6b7280' },
                'Rendered & Painted Wall': { rate: 180, description: 'Rendered & painted lightweight wall', color: '#374151' }
            },
            'fence-front': {
                'Aluminium Fence': { rate: 720, description: 'Aluminium Fence / Vertical Batten / 1800mmH', color: '#1e40af' },
                'Entry Wall': { rate: 2430, description: 'Entry wall, rendered painted masonry wall 1.8mH', color: '#1e3a8a' },
                'Intercom System': { rate: 5000, description: 'Intercom+strike smart control', color: '#1e293b' }
            },
            'pool-fence': {
                'Frameless Glass': { rate: 650, description: 'Frameless glass pool fence 1200mmH', color: '#0891b2' },
                'Flat Top': { rate: 220, description: 'Flat top pool fence', color: '#0e7490' }
            },
            'garden-edge': {
                'Garden Edge 100mmH': { rate: 50, description: 'Garden edge 100mmH', color: '#65a30d' }
            },
            'screen': {
                'Aluminium Batten Screen': { rate: 450, description: 'Aluminium batten screen 1800mmH', color: '#7c2d12' }
            },
            'retaining-wall': {
                'Concrete Sleeper 400mmH': { rate: 300, description: 'Concrete sleeper wall 400mmH', color: '#78716c' },
                'Concrete Sleeper 600mmH': { rate: 450, description: 'Concrete sleeper wall 600mmH', color: '#57534e' },
                'Concrete Sleeper 800mmH': { rate: 600, description: 'Concrete sleeper wall 800mmH', color: '#44403c' },
                'Concrete Sleeper 1mH': { rate: 750, description: 'Concrete sleeper wall 1mH', color: '#292524' },
                'Block Wall 400mmH': { rate: 420, description: 'Block Wall & Render & waterproof 400mmH', color: '#a8a29e' },
                'Block Wall 600mmH': { rate: 630, description: 'Block Wall & Render & waterproof 600mmH', color: '#78716c' },
                'Block Wall 800mmH': { rate: 840, description: 'Block Wall & Render & waterproof 800mmH', color: '#57534e' },
                'Block Wall 1mH': { rate: 1050, description: 'Block Wall & Render & waterproof 1mH', color: '#44403c' },
                'Besser Block 400mmH': { rate: 300, description: 'Besser block wall 400mmH', color: '#d6d3d1' },
                'Besser Block 600mmH': { rate: 450, description: 'Besser block wall 600mmH', color: '#a8a29e' },
                'Besser Block 800mmH': { rate: 600, description: 'Besser block wall 800mmH', color: '#78716c' },
                'Besser Block 1mH': { rate: 750, description: 'Besser block wall 1mH', color: '#57534e' }
            },
            'stairs': {
                'Concrete Step': { rate: 400, description: 'Concrete step', color: '#a8a29e' },
                'Concrete Steps - Tiled': { rate: 1000, description: 'Concrete steps - Tiled', color: '#78716c' },
                'Concrete Steps - Floating': { rate: 2000, description: 'Concrete steps - floating step', color: '#57534e' },
                'Corten Steel': { rate: 250, description: 'Corten steel with gravel step', color: '#44403c' }
            },
            'lighting': {
                'LED Path Light': { rate: 120, description: 'LED path lighting', color: '#fbbf24' },
                'LED Spot Light': { rate: 180, description: 'LED spot lighting', color: '#f59e0b' },
                'LED Flood Light': { rate: 250, description: 'LED flood lighting', color: '#d97706' },
                'LED Strip Light': { rate: 95, description: 'LED strip lighting', color: '#92400e' },
                'Solar Path Light': { rate: 85, description: 'Solar path lighting', color: '#78350f' }
            },
            'planter': {
                'Standard Planter': { rate: 500, description: 'Standard planter', color: '#8b5a2b' }
            }
        };
        
        this.rates = {};
        this.elementDescriptions = {};
        this.initializeRatesAndDescriptions();
        this.createPresetElements();
        
        this.init();
    }

    initializeRatesAndDescriptions() {
        // Initialize rates and descriptions from subtypes
        Object.entries(this.elementSubtypes).forEach(([type, subtypes]) => {
            Object.entries(subtypes).forEach(([subtype, config]) => {
                const key = `${type}-${subtype.toLowerCase().replace(/\s+/g, '-')}`;
                this.rates[key] = config.rate;
                this.elementDescriptions[key] = config.description;
            });
        });

        // Add other elements with improved descriptions
        const otherElements = {
            'seating': { rate: 850, description: 'Outdoor seating area' },
            'water-feature': { rate: 1200, description: 'Decorative water feature' },
            'outdoor-kitchen': { rate: 8500, description: 'Complete outdoor kitchen' },
            'trees': { rate: 150, description: 'Mature tree planting' },
            'pergola': { rate: 2500, description: 'Timber pergola structure' },
            'pool': { rate: 35000, description: 'Concrete swimming pool' },
            'spa': { rate: 8500, description: 'Hot tub spa installation' },
            'pool-fence': { rate: 150, description: 'Pool safety fencing' },
            'garden-edge': { rate: 35, description: 'Garden edging material' },
            'screen': { rate: 180, description: 'Privacy screen installation' },
            'retaining-wall': { rate: 250, description: 'Retaining wall construction' },
            'irrigation': { rate: 2500, description: 'Automatic irrigation system' },
            'lighting-system': { rate: 3500, description: 'Garden lighting system' }
        };

        Object.entries(otherElements).forEach(([key, config]) => {
            this.rates[key] = config.rate;
            this.elementDescriptions[key] = config.description;
        });
    }

    createPresetElements() {
        const container = document.getElementById('presetElements');
        container.innerHTML = '';
        
        Object.entries(this.presetConfigs).forEach(([type, config]) => {
            const presetDiv = document.createElement('div');
            presetDiv.className = 'preset-item p-3 rounded-md';
            presetDiv.dataset.type = type;
            
            presetDiv.innerHTML = `
                <div class="flex justify-between items-center">
                    <div>
                        <div class="text-sm font-semibold">${config.description}</div>
                        <div class="text-xs text-gray-600" id="${type}-size">${config.width}x${config.height}m</div>
                        <div class="text-xs text-green-600 font-medium">$${config.price.toLocaleString()}</div>
                    </div>
                    <div class="flex space-x-1">
                        <button class="config-preset text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors" data-type="${type}" title="Configure">
                            <i class="fas fa-cog"></i>
                        </button>
                        <button class="add-preset text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition-colors" data-type="${type}" title="Add to Design">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="preset-config" id="${type}-config">
                    <div class="grid grid-cols-2 gap-2 mb-2">
                        <input type="number" id="${type}-width" value="${config.width}" placeholder="Width" class="compact-input border rounded">
                        <input type="number" id="${type}-height" value="${config.height}" placeholder="Height" class="compact-input border rounded">
                    </div>
                    <input type="number" id="${type}-price" value="${config.price}" placeholder="Price" class="w-full compact-input border rounded mb-2">
                    <input type="text" id="${type}-description" value="${config.description}" placeholder="Description" class="w-full compact-input border rounded mb-2">
                    <div class="flex space-x-2">
                        <button class="save-preset flex-1 bg-green-600 text-white py-1 px-2 rounded text-xs hover:bg-green-700 transition-colors" data-type="${type}">
                            <i class="fas fa-save mr-1"></i>Save
                        </button>
                        <button class="cancel-preset flex-1 bg-gray-500 text-white py-1 px-2 rounded text-xs hover:bg-gray-600 transition-colors" data-type="${type}">
                            <i class="fas fa-times mr-1"></i>Cancel
                        </button>
                    </div>
                </div>
            `;
            
            container.appendChild(presetDiv);
        });
    }

    init() {
        this.setupEventListeners();
        this.setupRateModal();
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Show welcome message
        this.showNotification('Welcome to Garden Design Pro! Start by uploading a plan and setting the scale.', 'info');
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.redraw();
    }

    setupEventListeners() {
        // Tool selection
        document.getElementById('toolSelect').addEventListener('change', (e) => {
            this.currentTool = e.target.value;
            this.updateToolOptions();
            this.updateDrawingStatus();
            this.updateEditMode();
        });

        // Subtype selection
        document.getElementById('subtypeSelect').addEventListener('change', (e) => {
            this.currentSubtype = e.target.value;
        });

        // Height selection
        document.getElementById('heightSelect').addEventListener('change', (e) => {
            this.currentHeight = e.target.value;
        });

        // Stairs length selection
        document.getElementById('stairsLengthSelect').addEventListener('change', (e) => {
            this.currentStairsLength = e.target.value;
        });

        // PDF page selection
        document.getElementById('loadPdfPage').addEventListener('click', () => this.loadPdfPage());

        // Scale buttons
        document.getElementById('scaleBtn').addEventListener('click', () => this.startScaling());
        document.getElementById('confirmScale').addEventListener('click', () => this.confirmScaling());
        document.getElementById('cancelScale').addEventListener('click', () => this.cancelScaling());
        document.getElementById('scaleLength').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.confirmScaling();
            }
        });

        // Canvas events with improved handling
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('wheel', (e) => this.handleWheel(e));
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        this.canvas.addEventListener('dblclick', (e) => this.handleDoubleClick(e));

        // Keyboard events with improved shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));

        // Zoom controls
        document.getElementById('handTool').addEventListener('click', () => this.toggleHandTool());
        document.getElementById('rulerTool').addEventListener('click', () => this.toggleRulerTool());
        document.getElementById('eraserTool').addEventListener('click', () => this.toggleEraserTool());
        document.getElementById('zoomReset').addEventListener('click', () => this.resetZoom());
        document.getElementById('zoomFit').addEventListener('click', () => this.zoomFit());

        // Scale buttons
        document.getElementById('rescaleBtn').addEventListener('click', () => this.resetScale());

        // Clear and undo/redo buttons
        document.getElementById('clearAll').addEventListener('click', () => this.clearAll());
        document.getElementById('undoBtn').addEventListener('click', () => this.undo());
        document.getElementById('redoBtn').addEventListener('click', () => this.redo());

        // File upload
        document.getElementById('fileUpload').addEventListener('change', (e) => this.handleFileUpload(e));

        // Preset elements
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-preset')) {
                const type = e.target.closest('.add-preset').dataset.type;
                this.selectPreset(type);
            } else if (e.target.closest('.config-preset')) {
                const type = e.target.closest('.config-preset').dataset.type;
                this.togglePresetConfig(type);
            } else if (e.target.closest('.save-preset')) {
                const type = e.target.closest('.save-preset').dataset.type;
                this.savePresetConfig(type);
            } else if (e.target.closest('.cancel-preset')) {
                const type = e.target.closest('.cancel-preset').dataset.type;
                this.hidePresetConfig(type);
            }
        });

        // Rate settings
        document.getElementById('rateSettingsBtn').addEventListener('click', () => this.showRateModal());
        document.getElementById('closeRateModal').addEventListener('click', () => this.hideRateModal());
        document.getElementById('saveRates').addEventListener('click', () => this.saveRates());
        document.getElementById('stateSelect').addEventListener('change', (e) => this.changeState(e.target.value));
        document.getElementById('resetRates').addEventListener('click', () => this.resetRates());

        // Generate quote and export
        document.getElementById('generateQuote').addEventListener('click', () => this.generatePDF());
        document.getElementById('exportProject').addEventListener('click', () => this.exportProject());

        // Help modal
        document.getElementById('helpBtn').addEventListener('click', () => this.showHelpModal());
        document.getElementById('closeHelpModal').addEventListener('click', () => this.hideHelpModal());

        // Modal backdrop clicks
        document.getElementById('rateModal').addEventListener('click', (e) => {
            if (e.target.id === 'rateModal') this.hideRateModal();
        });
        document.getElementById('helpModal').addEventListener('click', (e) => {
            if (e.target.id === 'helpModal') this.hideHelpModal();
        });
    }

    handleKeyDown(e) {
        // Prevent default behavior for certain keys
        if (['Enter', 'Escape', 'Delete', 'Backspace'].includes(e.key)) {
            e.preventDefault();
        }

        switch (e.key) {
            case 'Enter':
                if (this.isDrawing) {
                    this.finishDrawing();
                } else if (this.scaleInputMode) {
                    this.confirmScaling();
                }
                break;
            case 'Escape':
                this.cancelDrawing();
                if (this.scaleInputMode) {
                    this.cancelScaling();
                }
                break;
            case 'Delete':
                if (this.selectedElement) {
                    this.deleteSelectedElement();
                }
                break;
            case 'Backspace':
                if (this.isDrawing && this.currentPath.length > 1) {
                    this.removeLastPoint();
                } else if (this.selectedElement) {
                    this.deleteSelectedElement();
                }
                break;
            case 'z':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    if (e.shiftKey) {
                        this.redo();
                    } else {
                        this.undo();
                    }
                }
                break;
            case 'd':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.toggleDeductMode();
                }
                break;
        }
    }

    removeLastPoint() {
        if (this.currentPath.length > 1) {
            this.currentPath.pop();
            this.redraw();
            this.updateDrawingStatus();
        }
    }

    handleDoubleClick(e) {
        if (this.isDrawing && this.currentPath.length > 2) {
            this.finishDrawing();
        }
    }

    updateDrawingStatus() {
        const statusDiv = document.getElementById('drawingStatus');
        const statusText = document.getElementById('statusText');
        
        if (this.isDrawing) {
            statusDiv.classList.remove('hidden');
            statusText.textContent = `Drawing ${this.currentTool}... (${this.currentPath.length} points)`;
        } else if (this.scalingMode) {
            statusDiv.classList.remove('hidden');
            statusText.textContent = `Setting scale... (${this.scalePoints.length}/2 points)`;
        } else {
            statusDiv.classList.add('hidden');
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 max-w-sm transition-all duration-300 transform translate-x-full`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        const colors = {
            success: 'bg-green-500 text-white',
            error: 'bg-red-500 text-white',
            warning: 'bg-yellow-500 text-white',
            info: 'bg-blue-500 text-white'
        };
        
        notification.className += ` ${colors[type]}`;
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="${icons[type]} mr-2"></i>
                <span>${message}</span>
                <button class="ml-auto text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    saveState() {
        const state = {
            elements: JSON.parse(JSON.stringify(this.elements)),
            scale: this.scale,
            scaleSet: this.scaleSet,
            backgroundImage: this.backgroundImage ? this.backgroundImage.src : null
        };
        
        this.undoStack.push(state);
        if (this.undoStack.length > this.maxUndoSteps) {
            this.undoStack.shift();
        }
        
        // Clear redo stack when new action is performed
        this.redoStack = [];
    }

    undo() {
        if (this.undoStack.length === 0) {
            this.showNotification('Nothing to undo', 'warning');
            return;
        }
        
        const currentState = {
            elements: JSON.parse(JSON.stringify(this.elements)),
            scale: this.scale,
            scaleSet: this.scaleSet,
            backgroundImage: this.backgroundImage ? this.backgroundImage.src : null
        };
        
        this.redoStack.push(currentState);
        
        const previousState = this.undoStack.pop();
        this.elements = previousState.elements;
        this.scale = previousState.scale;
        this.scaleSet = previousState.scaleSet;
        
        if (previousState.backgroundImage) {
            const img = new Image();
            img.onload = () => {
                this.backgroundImage = img;
                this.redraw();
            };
            img.src = previousState.backgroundImage;
        } else {
            this.backgroundImage = null;
        }
        
        this.redraw();
        this.updateQuote();
        this.showNotification('Undo completed', 'success');
    }

    redo() {
        if (this.redoStack.length === 0) {
            this.showNotification('Nothing to redo', 'warning');
            return;
        }
        
        const currentState = {
            elements: JSON.parse(JSON.stringify(this.elements)),
            scale: this.scale,
            scaleSet: this.scaleSet,
            backgroundImage: this.backgroundImage ? this.backgroundImage.src : null
        };
        
        this.undoStack.push(currentState);
        
        const nextState = this.redoStack.pop();
        this.elements = nextState.elements;
        this.scale = nextState.scale;
        this.scaleSet = nextState.scaleSet;
        
        if (nextState.backgroundImage) {
            const img = new Image();
            img.onload = () => {
                this.backgroundImage = img;
                this.redraw();
            };
            img.src = nextState.backgroundImage;
        } else {
            this.backgroundImage = null;
        }
        
        this.redraw();
        this.updateQuote();
        this.showNotification('Redo completed', 'success');
    }

    updateToolOptions() {
        const subtypeOptions = document.getElementById('subtypeOptions');
        const heightOptions = document.getElementById('heightOptions');
        const stairsLengthOptions = document.getElementById('stairsLengthOptions');
        const subtypeSelect = document.getElementById('subtypeSelect');
        
        // Show/hide subtype options
        if (this.elementSubtypes[this.currentTool]) {
            subtypeOptions.classList.remove('hidden');
            subtypeSelect.innerHTML = '';
            
            Object.keys(this.elementSubtypes[this.currentTool]).forEach(subtype => {
                const option = document.createElement('option');
                option.value = subtype;
                option.textContent = subtype;
                subtypeSelect.appendChild(option);
            });
            
            this.currentSubtype = subtypeSelect.value;
        } else if (this.currentTool === 'trees') {
            subtypeOptions.classList.remove('hidden');
            subtypeSelect.innerHTML = '';
            
            Object.keys(this.treeConfigs).forEach(subtype => {
                const option = document.createElement('option');
                option.value = subtype;
                option.textContent = subtype;
                subtypeSelect.appendChild(option);
            });
            
            this.currentSubtype = subtypeSelect.value;
        } else if (this.currentTool === 'shrubs') {
            subtypeOptions.classList.remove('hidden');
            subtypeSelect.innerHTML = '';
            
            Object.keys(this.shrubConfigs).forEach(subtype => {
                const option = document.createElement('option');
                option.value = subtype;
                option.textContent = subtype;
                subtypeSelect.appendChild(option);
            });
            
            this.currentSubtype = subtypeSelect.value;
        } else {
            subtypeOptions.classList.add('hidden');
            this.currentSubtype = null;
        }
        
        // Show/hide height options
        const heightElements = ['retaining-wall', 'garden-edge'];
        if (heightElements.includes(this.currentTool)) {
            heightOptions.classList.remove('hidden');
        } else {
            heightOptions.classList.add('hidden');
        }
        
        // Show/hide stairs length options
        if (this.currentTool === 'stairs') {
            stairsLengthOptions.classList.remove('hidden');
        } else {
            stairsLengthOptions.classList.add('hidden');
        }
    }

    updateEditMode() {
        this.editMode = this.currentTool === 'edit';
        this.handMode = this.currentTool === 'hand';
        this.rulerMode = this.currentTool === 'ruler';
        this.subtractMode = this.currentTool === 'subtract';
        this.eraserMode = this.currentTool === 'eraser';
        
        const container = document.querySelector('.canvas-container');
        const indicator = document.getElementById('editModeIndicator');
        
        // Clear all modes
        container.classList.remove('edit-mode', 'hand-mode', 'ruler-mode', 'subtract-mode', 'eraser-mode', 'deduct-mode');
        
        if (this.editMode) {
            container.classList.add('edit-mode');
            indicator.classList.remove('hidden');
            this.canvas.style.cursor = 'pointer';
        } else if (this.handMode) {
            container.classList.add('hand-mode');
            this.canvas.style.cursor = 'grab';
        } else if (this.rulerMode) {
            container.classList.add('ruler-mode');
            this.canvas.style.cursor = 'crosshair';
        } else if (this.subtractMode) {
            container.classList.add('subtract-mode');
            this.canvas.style.cursor = 'crosshair';
        } else if (this.eraserMode) {
            container.classList.add('eraser-mode');
            this.canvas.style.cursor = 'crosshair';
        } else if (this.deductMode) {
            container.classList.add('deduct-mode');
            this.canvas.style.cursor = 'crosshair';
        } else {
            indicator.classList.add('hidden');
            this.canvas.style.cursor = 'crosshair';
            this.clearEditPoints();
        }
    }

    toggleHandTool() {
        this.handMode = !this.handMode;
        this.currentTool = this.handMode ? 'hand' : 'select';
        document.getElementById('toolSelect').value = this.currentTool;
        this.updateEditMode();
        this.updateDrawingStatus();
        
        if (this.handMode) {
            this.showNotification('Hand tool activated - Click and drag to move the plan', 'info');
        }
    }

    toggleRulerTool() {
        this.currentTool = this.rulerMode ? 'select' : 'ruler';
        document.getElementById('toolSelect').value = this.currentTool;
        this.updateEditMode();
        this.clearRulerLines();
    }

    toggleEraserTool() {
        this.eraserMode = !this.eraserMode;
        this.currentTool = this.eraserMode ? 'eraser' : 'select';
        document.getElementById('toolSelect').value = this.currentTool;
        this.updateEditMode();
        this.updateDrawingStatus();
        
        if (this.eraserMode) {
            this.showNotification('Eraser tool activated - Click on elements to delete them. Right-click to exit eraser mode.', 'info');
        }
    }

    toggleDeductMode() {
        this.deductMode = !this.deductMode;
        this.updateEditMode();
        this.updateDrawingStatus();
        
        if (this.deductMode) {
            this.showNotification('Deduct mode activated - Draw areas to subtract from existing areas. Press Ctrl+D to exit.', 'info');
        }
    }

    clearRulerLines() {
        this.rulerLines.forEach(line => {
            if (line.element) {
                line.element.remove();
            }
        });
        this.rulerLines = [];
        this.rulerPoints = [];
    }

    clearEditPoints() {
        this.editPoints.forEach(point => {
            if (point.element) {
                point.element.remove();
            }
        });
        this.editPoints = [];
    }

    togglePresetConfig(type) {
        const config = document.getElementById(`${type}-config`);
        const isVisible = !config.style.display || config.style.display === 'none';
        
        // Hide all configs first
        document.querySelectorAll('.preset-config').forEach(c => c.style.display = 'none');
        
        if (isVisible) {
            config.style.display = 'block';
        }
    }

    hidePresetConfig(type) {
        const config = document.getElementById(`${type}-config`);
        config.style.display = 'none';
    }

    savePresetConfig(type) {
        const width = parseFloat(document.getElementById(`${type}-width`).value);
        const height = parseFloat(document.getElementById(`${type}-height`).value);
        const price = parseFloat(document.getElementById(`${type}-price`).value);
        const description = document.getElementById(`${type}-description`).value.trim();
        
        if (width > 0 && height > 0 && price >= 0 && description) {
            this.presetConfigs[type] = { width, height, price, description };
            this.rates[type] = price;
            this.elementDescriptions[type] = description;
            document.getElementById(`${type}-size`).textContent = `${width}x${height}m`;
            document.getElementById(`${type}-config`).style.display = 'none';
            this.updateQuote();
            this.showNotification(`${description} configuration saved`, 'success');
        } else {
            this.showNotification('Please fill in all fields with valid values', 'error');
        }
    }

    handleWheel(e) {
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Math.max(0.1, Math.min(5, this.zoom * zoomFactor));
        
        // Zoom towards mouse position
        this.panX = mouseX - (mouseX - this.panX) * (newZoom / this.zoom);
        this.panY = mouseY - (mouseY - this.panY) * (newZoom / this.zoom);
        this.zoom = newZoom;
        
        this.redraw();
    }

    zoomIn() {
        this.zoom = Math.min(5, this.zoom * 1.2);
        this.redraw();
    }

    zoomOut() {
        this.zoom = Math.max(0.1, this.zoom / 1.2);
        this.redraw();
    }

    resetZoom() {
        this.zoom = 1;
        this.panX = 0;
        this.panY = 0;
        this.redraw();
    }

    zoomFit() {
        if (this.elements.length === 0 && !this.backgroundImage) {
            this.resetZoom();
            return;
        }
        
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        
        // Calculate bounds from elements
        this.elements.forEach(element => {
            if (element.type === 'trees' || element.type === 'lighting') {
                minX = Math.min(minX, element.x - 50);
                minY = Math.min(minY, element.y - 50);
                maxX = Math.max(maxX, element.x + 50);
                maxY = Math.max(maxY, element.y + 50);
            } else if (['pergola', 'pool', 'spa'].includes(element.type) && element.width && element.height) {
                minX = Math.min(minX, element.x);
                minY = Math.min(minY, element.y);
                maxX = Math.max(maxX, element.x + element.width);
                maxY = Math.max(maxY, element.y + element.height);
            } else if (element.path && element.path.length > 0) {
                element.path.forEach(point => {
                    minX = Math.min(minX, point.x);
                    minY = Math.min(minY, point.y);
                    maxX = Math.max(maxX, point.x);
                    maxY = Math.max(maxY, point.y);
                });
            }
        });
        
        // Add padding
        const padding = 100;
        minX -= padding;
        minY -= padding;
        maxX += padding;
        maxY += padding;
        
        const width = maxX - minX;
        const height = maxY - minY;
        
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        
        const scaleX = canvasWidth / width;
        const scaleY = canvasHeight / height;
        this.zoom = Math.min(scaleX, scaleY, 5); // Max zoom 5x
        
        this.panX = -minX * this.zoom + (canvasWidth - width * this.zoom) / 2;
        this.panY = -minY * this.zoom + (canvasHeight - height * this.zoom) / 2;
        
        this.redraw();
    }

    getCanvasCoordinates(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left - this.panX) / this.zoom;
        const y = (e.clientY - rect.top - this.panY) / this.zoom;
        return { x, y };
    }

    handleMouseDown(e) {
        // Handle right-click
        if (e.button === 2) {
            e.preventDefault();
            if (this.eraserMode) {
                this.toggleEraserTool(); // Exit eraser mode
            } else {
                this.cancelDrawing();
            }
            return;
        }
        
        if (e.button === 1 || (e.button === 0 && (e.ctrlKey || this.handMode))) {
            this.isPanning = true;
            this.lastPanPoint = { x: e.clientX, y: e.clientY };
            this.canvas.style.cursor = 'grabbing';
        }
    }

    handleMouseMove(e) {
        if (this.isPanning) {
            const dx = e.clientX - this.lastPanPoint.x;
            const dy = e.clientY - this.lastPanPoint.y;
            this.panX += dx;
            this.panY += dy;
            this.lastPanPoint = { x: e.clientX, y: e.clientY };
            this.redraw();
            return;
        }

        const coords = this.getCanvasCoordinates(e);
        this.showElementInfo(coords.x, coords.y);
    }

    handleMouseUp(e) {
        if (this.isPanning) {
            this.isPanning = false;
            if (this.handMode) {
                this.canvas.style.cursor = 'grab';
            } else {
                this.canvas.style.cursor = 'crosshair';
            }
        }
    }

    handleClick(e) {
        if (this.isPanning) return;
        
        const coords = this.getCanvasCoordinates(e);
        const x = coords.x;
        const y = coords.y;

        // Handle scaling mode
        if (this.scalingMode && this.scalePoints.length < 2) {
            this.scalePoints.push({x, y});
            
            if (this.scalePoints.length === 2) {
                this.showScaleInput();
            }
            this.redraw();
            return;
        }

        // Handle ruler tool
        if (this.rulerMode) {
            this.handleRulerClick(x, y);
            return;
        }

        // Handle edit mode
        if (this.editMode) {
            this.handleEditClick(x, y);
            return;
        }

        // Handle eraser tool
        if (this.eraserMode) {
            this.handleEraserClick(x, y);
            return;
        }

        // Handle hand tool
        if (this.handMode) {
            this.startPanning(e);
            return;
        }

        // Handle seating placement
        if (this.currentTool === 'seating') {
            this.addSeating(x, y);
            return;
        }

        // Handle water feature placement
        if (this.currentTool === 'water-feature') {
            this.addWaterFeature(x, y);
            return;
        }

        // Handle outdoor kitchen placement
        if (this.currentTool === 'outdoor-kitchen') {
            this.addOutdoorKitchen(x, y);
            return;
        }

        // Handle planter placement
        if (this.currentTool === 'planter') {
            this.addPlanter(x, y);
            return;
        }

        // Handle preset element placement
        if (this.currentTool === 'preset' && this.presetType) {
            this.addPresetElement(x, y);
            return;
        }

        // Handle tree placement
        if (this.currentTool === 'trees') {
            this.addTree(x, y);
            return;
        }

        if (this.currentTool === 'shrubs') {
            this.addShrub(x, y);
            return;
        }

        // Handle lighting placement
        if (this.currentTool === 'lighting') {
            this.addLighting(x, y);
            return;
        }

        // Handle stairs drawing
        if (this.currentTool === 'stairs') {
            this.addStairs(x, y);
            return;
        }

        // Handle area drawing
        if (this.isAreaTool(this.currentTool)) {
            if (!this.isDrawing) {
                this.startArea(x, y);
            } else {
                // Check if point is close to the first point to auto-close
                if (this.currentPath.length > 2) {
                    const firstPoint = this.currentPath[0];
                    const distance = Math.sqrt((x - firstPoint.x) ** 2 + (y - firstPoint.y) ** 2);
                    if (distance < 20 / this.zoom) { // 20 pixels threshold
                        this.finishDrawing();
                        return;
                    }
                }
                this.currentPath.push({x, y});
                this.redraw();
            }
            return;
        }

        // Handle area subtraction
        if (this.subtractMode) {
            if (!this.isDrawing) {
                this.startSubtractArea(x, y);
            } else {
                this.currentPath.push({x, y});
                this.redraw();
            }
            return;
        }

        // Handle deduct mode
        if (this.deductMode) {
            if (!this.isDrawing) {
                this.startDeductArea(x, y);
            } else {
                // Check if point is close to the first point to auto-close
                if (this.currentPath.length > 2) {
                    const firstPoint = this.currentPath[0];
                    const distance = Math.sqrt((x - firstPoint.x) ** 2 + (y - firstPoint.y) ** 2);
                    if (distance < 20 / this.zoom) { // 20 pixels threshold
                        this.finishDeductArea();
                        return;
                    }
                }
                this.currentPath.push({x, y});
                this.redraw();
            }
            return;
        }

        // Handle linear drawing
        if (this.isLinearTool(this.currentTool)) {
            if (!this.isDrawing) {
                this.addLinePoint(x, y);
            } else {
                this.currentPath.push({x, y});
                this.redraw();
            }
            return;
        }

        // Handle selection
        if (this.currentTool === 'select') {
            this.selectElement(x, y);
        }
    }

    handleRulerClick(x, y) {
        this.rulerPoints.push({x, y});
        
        if (this.rulerPoints.length === 2) {
            this.createRulerLine();
            this.rulerPoints = [];
        }
    }

    createRulerLine() {
        const p1 = this.rulerPoints[0];
        const p2 = this.rulerPoints[1];
        
        const distance = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
        const actualDistance = this.scaleSet ? distance / this.scale : distance;
        
        // Create SVG line
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', this.canvas.width);
        svg.setAttribute('height', this.canvas.height);
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.pointerEvents = 'none';
        
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', p1.x * this.zoom + this.panX);
        line.setAttribute('y1', p1.y * this.zoom + this.panY);
        line.setAttribute('x2', p2.x * this.zoom + this.panX);
        line.setAttribute('y2', p2.y * this.zoom + this.panY);
        line.setAttribute('stroke', '#ef4444');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('stroke-dasharray', '5,5');
        
        svg.appendChild(line);
        
        // Create measurement label
        const measurement = document.createElement('div');
        measurement.className = 'ruler-measurement';
        const midX = (p1.x + p2.x) / 2 * this.zoom + this.panX;
        const midY = (p1.y + p2.y) / 2 * this.zoom + this.panY;
        measurement.style.left = (midX - 20) + 'px';
        measurement.style.top = (midY - 15) + 'px';
        measurement.textContent = `${actualDistance.toFixed(2)}m`;
        
        const container = document.querySelector('.canvas-container');
        container.appendChild(svg);
        container.appendChild(measurement);
        
        this.rulerLines.push({
            element: svg,
            measurement: measurement,
            points: [p1, p2]
        });
    }

    startPanning(e) {
        if (this.handMode || e.ctrlKey) {
            this.isPanning = true;
            this.lastPanPoint = { x: e.clientX, y: e.clientY };
            this.canvas.style.cursor = 'grabbing';
        }
    }

    handleEditClick(x, y) {
        // Check if clicking on an edit point
        for (let i = this.editPoints.length - 1; i >= 0; i--) {
            const point = this.editPoints[i];
            const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
            if (distance < 10 / this.zoom) {
                this.draggedPoint = point;
                return;
            }
        }

        // Check if clicking on an element
        for (let element of this.elements) {
            if (this.isPointInElement(x, y, element)) {
                this.selectedElement = element;
                this.showEditPoints(element);
                this.redraw();
                return;
            }
        }

        // Clear selection if clicking elsewhere
        this.selectedElement = null;
        this.clearEditPoints();
        this.redraw();
    }

    showEditPoints(element) {
        this.clearEditPoints();
        
        if (element.type === 'trees' || element.type === 'lighting') {
            // Single point for trees and lighting
            this.createEditPoint(element.x, element.y, element, 'position');
        } else if (['pergola', 'pool', 'spa'].includes(element.type) && element.width && element.height) {
            // Corner points for rectangular elements
            this.createEditPoint(element.x, element.y, element, 'corner1');
            this.createEditPoint(element.x + element.width, element.y, element, 'corner2');
            this.createEditPoint(element.x, element.y + element.height, element, 'corner3');
            this.createEditPoint(element.x + element.width, element.y + element.height, element, 'corner4');
        } else if (element.path && element.path.length > 0) {
            // Path points for linear and area elements
            element.path.forEach((point, index) => {
                this.createEditPoint(point.x, point.y, element, `path${index}`);
            });
        }
    }

    createEditPoint(x, y, element, type) {
        const pointDiv = document.createElement('div');
        pointDiv.className = 'edit-point';
        pointDiv.style.left = (x * this.zoom + this.panX - 4) + 'px';
        pointDiv.style.top = (y * this.zoom + this.panY - 4) + 'px';
        
        const container = document.querySelector('.canvas-container');
        container.appendChild(pointDiv);
        
        this.editPoints.push({
            x: x,
            y: y,
            element: pointDiv,
            parentElement: element,
            type: type
        });
    }

    isAreaTool(tool) {
        return ['driveway-concrete', 'plain-concrete', 'paving', 'decking', 'garden-beds', 'lawn', 'shed'].includes(tool);
    }

    isLinearTool(tool) {
        return ['fence-boundary', 'fence-front', 'pool-fence', 'garden-edge', 'screen', 'retaining-wall', 'stairs'].includes(tool);
    }

    startArea(x, y) {
        if (!this.isDrawing) {
            this.isDrawing = true;
            this.currentPath = [{x, y}];
            this.updateDrawingStatus();
        }
        this.redraw();
    }

    startSubtractArea(x, y) {
        if (!this.isDrawing) {
            this.isDrawing = true;
            this.currentPath = [{x, y}];
            this.updateDrawingStatus();
        }
        this.redraw();
    }

    startDeductArea(x, y) {
        this.isDrawing = true;
        this.currentPath = [{x, y}];
        this.currentTool = 'deduct';
        this.updateDrawingStatus();
        this.redraw();
    }

    finishDeductArea() {
        if (this.currentPath.length > 2) {
            this.saveState();
            
            // Find the area element to deduct from
            const deductFrom = this.findAreaToDeductFrom();
            if (deductFrom) {
                // Create a new element with the deducted area
                const deductedElement = {
                    ...deductFrom,
                    path: this.subtractPolygons(deductFrom.path, this.currentPath),
                    id: Date.now()
                };
                
                // Remove the original element and add the deducted one
                const index = this.elements.indexOf(deductFrom);
                this.elements.splice(index, 1);
                this.elements.push(deductedElement);
                
                this.showNotification('Area deducted successfully', 'success');
            } else {
                this.showNotification('No area element found to deduct from', 'warning');
            }
        }
        
        this.isDrawing = false;
        this.currentPath = [];
        this.updateDrawingStatus();
        this.redraw();
        this.updateQuote();
    }

    findAreaToDeductFrom() {
        // Find the first area element that contains the center of the deduct path
        const centerX = this.currentPath.reduce((sum, p) => sum + p.x, 0) / this.currentPath.length;
        const centerY = this.currentPath.reduce((sum, p) => sum + p.y, 0) / this.currentPath.length;
        
        return this.elements.find(element => 
            this.isAreaTool(element.type) && 
            this.pointInPolygon(centerX, centerY, element.path)
        );
    }

    subtractPolygons(originalPath, deductPath) {
        // Simple polygon subtraction - this is a basic implementation
        // For more complex cases, you might want to use a library like clipper.js
        
        // For now, we'll create a new path that excludes the deducted area
        // This is a simplified approach - in practice, you'd want proper polygon clipping
        
        const result = [...originalPath];
        
        // Add the deduct path in reverse to create a "hole"
        for (let i = deductPath.length - 1; i >= 0; i--) {
            result.push(deductPath[i]);
        }
        
        return result;
    }

    addLinePoint(x, y) {
        if (!this.isDrawing) {
            this.isDrawing = true;
            this.currentPath = [{x, y}];
            this.updateDrawingStatus();
        }
        this.redraw();
    }

    addTree(x, y) {
        this.saveState();
        const treeType = this.currentSubtype || 'Medium Tree';
        const config = this.treeConfigs[treeType];
        
        const element = {
            type: 'trees',
            subtype: treeType,
            x: x,
            y: y,
            diameter: config.diameter,
            price: config.price,
            description: config.description,
            id: Date.now()
        };
        this.elements.push(element);
        this.redraw();
        this.updateQuote();
        this.showNotification(`${config.description} added`, 'success');
    }

    addShrub(x, y) {
        this.saveState();
        const shrubType = this.currentSubtype || 'Medium Shrub';
        const config = this.shrubConfigs[shrubType];
        
        const element = {
            type: 'shrubs',
            subtype: shrubType,
            x: x,
            y: y,
            diameter: config.diameter,
            price: config.price,
            description: config.description,
            id: Date.now()
        };
        this.elements.push(element);
        this.redraw();
        this.updateQuote();
        this.showNotification(`${config.description} added`, 'success');
    }

    addLighting(x, y) {
        this.saveState();
        const element = {
            type: 'lighting',
            subtype: 'Garden Light',
            x: x,
            y: y,
            id: Date.now()
        };
        this.elements.push(element);
        this.redraw();
        this.updateQuote();
        this.showNotification('Lighting added to design', 'success');
    }

    addStairs(x, y) {
        this.saveState();
        const length = parseFloat(document.getElementById('stairsLengthSelect').value) / 1000; // Convert mm to m
        const pixelLength = this.scaleSet ? length * this.scale : length * 20;
        
        const element = {
            type: 'stairs',
            subtype: 'Concrete Steps (per step)',
            x: x,
            y: y,
            length: pixelLength,
            actualLength: length,
            rotation: 0,
            id: Date.now()
        };
        this.elements.push(element);
        this.redraw();
        this.updateQuote();
        this.showNotification('Stairs added to design', 'success');
    }

    handleEraserClick(x, y) {
        // Find and delete element at click position
        for (let i = this.elements.length - 1; i >= 0; i--) {
            const element = this.elements[i];
            if (this.isPointInElement(x, y, element)) {
                this.saveState();
                this.elements.splice(i, 1);
                this.redraw();
                this.updateQuote();
                this.showNotification('Element deleted', 'success');
                return;
            }
        }
        this.showNotification('No element found at this location', 'info');
    }

    addSeating(x, y) {
        this.saveState();
        const element = {
            type: 'seating',
            subtype: 'GRC Concrete seats-Straight',
            x: x,
            y: y,
            rotation: 0,
            id: Date.now()
        };
        this.elements.push(element);
        this.redraw();
        this.updateQuote();
        this.showNotification('Seating added to design', 'success');
    }

    addWaterFeature(x, y) {
        this.saveState();
        const element = {
            type: 'water-feature',
            subtype: 'Water Feature',
            x: x,
            y: y,
            rotation: 0,
            id: Date.now()
        };
        this.elements.push(element);
        this.redraw();
        this.updateQuote();
        this.showNotification('Water feature added to design', 'success');
    }

    addOutdoorKitchen(x, y) {
        this.saveState();
        const element = {
            type: 'outdoor-kitchen',
            subtype: 'Outdoor kitchen Allowance',
            x: x,
            y: y,
            rotation: 0,
            id: Date.now()
        };
        this.elements.push(element);
        this.redraw();
        this.updateQuote();
        this.showNotification('Outdoor kitchen added to design', 'success');
    }

    addPlanter(x, y) {
        this.saveState();
        const element = {
            type: 'planter',
            subtype: 'Standard Planter',
            x: x,
            y: y,
            rotation: 0,
            id: Date.now()
        };
        this.elements.push(element);
        this.redraw();
        this.updateQuote();
        this.showNotification('Planter added to design', 'success');
    }

    finishDrawing() {
        if (this.currentPath.length > 1) {
            this.saveState();
            const height = document.getElementById('heightSelect').value;
            const element = {
                type: this.currentTool,
                subtype: this.currentSubtype || 'Standard',
                path: [...this.currentPath],
                height: height,
                id: Date.now()
            };
            this.elements.push(element);
            this.showNotification(`${this.getElementDescription(element)} added to design`, 'success');
        }
        this.isDrawing = false;
        this.currentPath = [];
        this.updateDrawingStatus();
        this.redraw();
        this.updateQuote();
    }

    cancelDrawing() {
        this.isDrawing = false;
        this.currentPath = [];
        this.scalingMode = false;
        this.scalePoints = [];
        this.currentTool = 'select';
        document.getElementById('toolSelect').value = 'select';
        this.updateDrawingStatus();
        this.redraw();
    }

    selectElement(x, y) {
        for (let element of this.elements) {
            if (this.isPointInElement(x, y, element)) {
                this.selectedElement = element;
                this.redraw();
                return;
            }
        }
        this.selectedElement = null;
        this.redraw();
    }

    deleteSelectedElement() {
        if (this.selectedElement) {
            this.saveState();
            const index = this.elements.indexOf(this.selectedElement);
            if (index > -1) {
                this.elements.splice(index, 1);
                this.selectedElement = null;
                this.redraw();
                this.updateQuote();
                this.showNotification('Element deleted', 'success');
            }
        }
    }

    isPointInElement(x, y, element) {
        if (element.type === 'trees') {
            const distance = Math.sqrt((x - element.x) ** 2 + (y - element.y) ** 2);
            return distance < 10;
        }
        
        if (['pergola', 'pool', 'spa'].includes(element.type) && element.width && element.height) {
            return x >= element.x && x <= element.x + element.width &&
                   y >= element.y && y <= element.y + element.height;
        }
        
        if (element.path && element.path.length > 2) {
            if (this.isAreaTool(element.type)) {
                return this.pointInPolygon(x, y, element.path);
            } else {
                return this.pointNearLine(x, y, element.path, 5);
            }
        }
        
        return false;
    }

    pointInPolygon(x, y, polygon) {
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            if (((polygon[i].y > y) !== (polygon[j].y > y)) &&
                (x < (polygon[j].x - polygon[i].x) * (y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x)) {
                inside = !inside;
            }
        }
        return inside;
    }

    pointNearLine(x, y, path, threshold) {
        for (let i = 1; i < path.length; i++) {
            const dist = this.distanceToLineSegment(x, y, path[i-1], path[i]);
            if (dist < threshold) return true;
        }
        return false;
    }

    distanceToLineSegment(px, py, p1, p2) {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        if (length === 0) return Math.sqrt((px - p1.x) ** 2 + (py - p1.y) ** 2);
        
        const t = Math.max(0, Math.min(1, ((px - p1.x) * dx + (py - p1.y) * dy) / (length * length)));
        const projection = { x: p1.x + t * dx, y: p1.y + t * dy };
        return Math.sqrt((px - projection.x) ** 2 + (py - projection.y) ** 2);
    }

    showElementInfo(x, y) {
        const info = document.getElementById('elementInfo');
        for (let element of this.elements) {
            if (this.isPointInElement(x, y, element)) {
                const measurement = this.calculateMeasurement(element);
                const description = this.getElementDescription(element);
                info.style.display = 'block';
                info.style.left = (x * this.zoom + this.panX + 10) + 'px';
                info.style.top = (y * this.zoom + this.panY - 30) + 'px';
                info.innerHTML = `<strong>${description}</strong><br>${measurement}`;
                return;
            }
        }
        info.style.display = 'none';
    }

    getElementDescription(element) {
        if (element.customDescription) {
            return element.customDescription;
        }
        
        if (element.subtype && element.subtype !== 'Standard') {
            return element.subtype;
        }
        
        return this.elementDescriptions[element.type] || element.type.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    calculateMeasurement(element) {
        if (!this.scaleSet) return 'Scale not set';
        
        if (element.type === 'trees') {
            return '1 tree';
        }
        
        if (['pergola', 'pool', 'spa'].includes(element.type) && element.actualWidth && element.actualHeight) {
            return `${element.actualWidth}m × ${element.actualHeight}m`;
        }
        
        if (element.path) {
            if (this.currentTool === 'stairs' || element.type === 'stairs') {
                const length = this.calculateLength(element.path) / this.scale;
                const steps = Math.ceil(length / 0.3);
                return `${steps} steps (${length.toFixed(2)}m)`;
            } else if (this.isAreaTool(element.type)) {
                const area = this.calculateArea(element.path) / (this.scale * this.scale);
                return `${area.toFixed(2)} m²`;
            } else {
                const length = this.calculateLength(element.path) / this.scale;
                return `${length.toFixed(2)} m`;
            }
        }
        
        return '';
    }

    calculateArea(path) {
        if (path.length < 3) return 0;
        let area = 0;
        for (let i = 0; i < path.length; i++) {
            const j = (i + 1) % path.length;
            area += path[i].x * path[j].y;
            area -= path[j].x * path[i].y;
        }
        return Math.abs(area) / 2;
    }

    calculateLength(path) {
        let length = 0;
        for (let i = 1; i < path.length; i++) {
            const dx = path[i].x - path[i-1].x;
            const dy = path[i].y - path[i-1].y;
            length += Math.sqrt(dx * dx + dy * dy);
        }
        return length;
    }

    startScaling() {
        this.scalePoints = [];
        this.scalingMode = true;
        this.scaleSet = false;
        this.currentTool = 'scale';
        document.getElementById('toolSelect').value = 'select';
        this.updateDrawingStatus();
        this.showNotification('Click two points on the plan that represent the distance to measure', 'info');
    }

    showScaleInput() {
        this.scaleInputMode = true;
        document.getElementById('scaleInputModal').classList.remove('hidden');
        document.getElementById('scaleLength').focus();
        this.showNotification('Enter the actual distance in meters and press Enter or click Confirm', 'info');
    }

    confirmScaling() {
        const actualLength = parseFloat(document.getElementById('scaleLength').value);
        if (!actualLength || actualLength <= 0) {
            this.showNotification('Please enter a valid distance in meters', 'error');
            document.getElementById('scaleLength').focus();
            return;
        }
        
        this.completeScaling(actualLength);
    }

    cancelScaling() {
        this.scaleInputMode = false;
        this.scalingMode = false;
        this.scalePoints = [];
        document.getElementById('scaleInputModal').classList.add('hidden');
        document.getElementById('scaleLength').value = '';
        this.updateDrawingStatus();
        this.redraw();
    }

    completeScaling(actualLength) {
        const distance = Math.sqrt(
            (this.scalePoints[1].x - this.scalePoints[0].x) ** 2 +
            (this.scalePoints[1].y - this.scalePoints[0].y) ** 2
        );
        
        if (distance === 0) {
            this.showNotification('Please click two different points', 'error');
            this.scalePoints = [];
            this.redraw();
            return;
        }
        
        this.scale = distance / actualLength;
        this.scaleSet = true;
        this.scalingMode = false;
        this.scaleInputMode = false;
        this.currentTool = 'select';
        document.getElementById('toolSelect').value = 'select';
        document.getElementById('scaleDisplay').textContent = `1:${Math.round(actualLength/distance * 1000)} (${this.scale.toFixed(2)} px/m)`;
        
        document.getElementById('scaleInputModal').classList.add('hidden');
        document.getElementById('scaleLength').value = '';
        this.updateDrawingStatus();
        
        // Show scale status indicator
        this.showScaleStatus(`Scale set: 1:${Math.round(actualLength/distance * 1000)}`);
        
        setTimeout(() => {
            this.scalePoints = [];
            this.redraw();
        }, 2000);
        
        this.redraw();
        this.updateQuote();
        this.showNotification('Scale set successfully!', 'success');
    }

    showScaleStatus(message) {
        let statusDiv = document.getElementById('scaleStatus');
        if (!statusDiv) {
            statusDiv = document.createElement('div');
            statusDiv.id = 'scaleStatus';
            statusDiv.className = 'scale-status';
            document.querySelector('.canvas-container').appendChild(statusDiv);
        }
        
        statusDiv.textContent = message;
        statusDiv.style.display = 'block';
        
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 3000);
    }

    resetScale() {
        this.scale = 1;
        this.scaleSet = false;
        this.scalePoints = [];
        this.scalingMode = false;
        this.currentTool = 'select';
        document.getElementById('scaleDisplay').textContent = 'Not set';
        document.getElementById('scaleLength').value = '';
        this.updateDrawingStatus();
        this.redraw();
        this.showNotification('Scale reset', 'info');
    }

    redraw() {
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Apply zoom and pan
        this.ctx.translate(this.panX, this.panY);
        this.ctx.scale(this.zoom, this.zoom);
        
        // Draw background image if loaded
        if (this.backgroundImage) {
            const imgAspect = this.backgroundImage.width / this.backgroundImage.height;
            const canvasAspect = (this.canvas.width / this.zoom) / (this.canvas.height / this.zoom);
            
            let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
            
            if (imgAspect > canvasAspect) {
                drawWidth = this.canvas.width / this.zoom;
                drawHeight = (this.canvas.width / this.zoom) / imgAspect;
                offsetY = ((this.canvas.height / this.zoom) - drawHeight) / 2;
            } else {
                drawHeight = this.canvas.height / this.zoom;
                drawWidth = (this.canvas.height / this.zoom) * imgAspect;
                offsetX = ((this.canvas.width / this.zoom) - drawWidth) / 2;
            }
            
            this.ctx.drawImage(this.backgroundImage, offsetX, offsetY, drawWidth, drawHeight);
        }
        
        // Draw scale points
        if (this.scalePoints.length > 0) {
            this.ctx.strokeStyle = '#ef4444';
            this.ctx.fillStyle = '#ef4444';
            this.ctx.lineWidth = 3 / this.zoom;
            
            this.scalePoints.forEach((point, index) => {
                this.ctx.beginPath();
                this.ctx.arc(point.x, point.y, 6 / this.zoom, 0, 2 * Math.PI);
                this.ctx.fill();
                
                if (index > 0) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.scalePoints[index-1].x, this.scalePoints[index-1].y);
                    this.ctx.lineTo(point.x, point.y);
                    this.ctx.stroke();
                }
            });
        }
        
        // Draw elements
        this.elements.forEach(element => this.drawElement(element));
        
        // Draw current path with measurements
        if (this.currentPath.length > 0) {
            this.ctx.strokeStyle = '#3b82f6';
            this.ctx.fillStyle = '#3b82f6';
            this.ctx.lineWidth = 2 / this.zoom;
            
            this.currentPath.forEach((point, index) => {
                this.ctx.beginPath();
                this.ctx.arc(point.x, point.y, 4 / this.zoom, 0, 2 * Math.PI);
                this.ctx.fill();
                
                if (index > 0) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.currentPath[index-1].x, this.currentPath[index-1].y);
                    this.ctx.lineTo(point.x, point.y);
                    this.ctx.stroke();
                    
                    // Show measurement for line segments
                    if (this.showMeasurements && this.scaleSet) {
                        const midX = (this.currentPath[index-1].x + point.x) / 2;
                        const midY = (this.currentPath[index-1].y + point.y) / 2;
                        const distance = Math.sqrt((point.x - this.currentPath[index-1].x) ** 2 + (point.y - this.currentPath[index-1].y) ** 2);
                        const actualDistance = distance / this.scale;
                        
                        this.ctx.fillStyle = 'rgba(34, 197, 94, 0.9)';
                        this.ctx.fillRect(midX - 20, midY - 8, 40, 16);
                        this.ctx.fillStyle = 'white';
                        this.ctx.font = `${10 / this.zoom}px Arial`;
                        this.ctx.textAlign = 'center';
                        this.ctx.fillText(`${actualDistance.toFixed(2)}m`, midX, midY + 3);
                    }
                }
            });
            
            if (this.isAreaTool(this.currentTool) && this.currentPath.length > 2) {
                this.ctx.setLineDash([5 / this.zoom, 5 / this.zoom]);
                this.ctx.beginPath();
                this.ctx.moveTo(this.currentPath[this.currentPath.length - 1].x, this.currentPath[this.currentPath.length - 1].y);
                this.ctx.lineTo(this.currentPath[0].x, this.currentPath[0].y);
                this.ctx.stroke();
                this.ctx.setLineDash([]);
                
                // Show area measurement
                if (this.showMeasurements && this.scaleSet) {
                    const area = this.calculateArea(this.currentPath) / (this.scale * this.scale);
                    const centerX = this.currentPath.reduce((sum, p) => sum + p.x, 0) / this.currentPath.length;
                    const centerY = this.currentPath.reduce((sum, p) => sum + p.y, 0) / this.currentPath.length;
                    
                    this.ctx.fillStyle = 'rgba(34, 197, 94, 0.9)';
                    this.ctx.fillRect(centerX - 30, centerY - 8, 60, 16);
                    this.ctx.fillStyle = 'white';
                    this.ctx.font = `${10 / this.zoom}px Arial`;
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText(`${area.toFixed(2)}m²`, centerX, centerY + 3);
                }
            }
        }
        
        this.ctx.restore();
        
        // Update edit points positions
        this.updateEditPoints();
    }

    updateEditPoints() {
        this.editPoints.forEach(point => {
            if (point.element) {
                point.element.style.left = (point.x * this.zoom + this.panX - 4) + 'px';
                point.element.style.top = (point.y * this.zoom + this.panY - 4) + 'px';
            }
        });
    }

    drawElement(element) {
        const isSelected = this.selectedElement === element;
        
        if (element.type === 'trees') {
            this.ctx.fillStyle = 'rgba(22, 163, 74, 0.7)'; // Semi-transparent green
            this.ctx.beginPath();
            this.ctx.arc(element.x, element.y, 8 / this.zoom, 0, 2 * Math.PI);
            this.ctx.fill();
            if (isSelected) {
                this.ctx.strokeStyle = '#3b82f6';
                this.ctx.lineWidth = 2 / this.zoom;
                this.ctx.stroke();
            }
            return;
        }

        if (element.type === 'shrubs') {
            this.ctx.fillStyle = '#059669';
            this.ctx.beginPath();
            this.ctx.arc(element.x, element.y, 6 / this.zoom, 0, 2 * Math.PI);
            this.ctx.fill();
            if (isSelected) {
                this.ctx.strokeStyle = '#3b82f6';
                this.ctx.lineWidth = 2 / this.zoom;
                this.ctx.stroke();
            }
            return;
        }

        if (element.type === 'seating') {
            this.ctx.save();
            this.ctx.translate(element.x, element.y);
            this.ctx.rotate(element.rotation || 0);
            this.ctx.fillStyle = '#7c3aed';
            this.ctx.fillRect(-15 / this.zoom, -5 / this.zoom, 30 / this.zoom, 10 / this.zoom);
            this.ctx.restore();
            if (isSelected) {
                this.ctx.strokeStyle = '#3b82f6';
                this.ctx.lineWidth = 2 / this.zoom;
                this.ctx.strokeRect(element.x - 15 / this.zoom, element.y - 5 / this.zoom, 30 / this.zoom, 10 / this.zoom);
            }
            return;
        }

        if (element.type === 'water-feature') {
            this.ctx.save();
            this.ctx.translate(element.x, element.y);
            this.ctx.rotate(element.rotation || 0);
            this.ctx.fillStyle = '#0891b2';
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 12 / this.zoom, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.restore();
            if (isSelected) {
                this.ctx.strokeStyle = '#3b82f6';
                this.ctx.lineWidth = 2 / this.zoom;
                this.ctx.stroke();
            }
            return;
        }

        if (element.type === 'outdoor-kitchen') {
            this.ctx.save();
            this.ctx.translate(element.x, element.y);
            this.ctx.rotate(element.rotation || 0);
            this.ctx.fillStyle = '#dc2626';
            this.ctx.fillRect(-20 / this.zoom, -10 / this.zoom, 40 / this.zoom, 20 / this.zoom);
            this.ctx.restore();
            if (isSelected) {
                this.ctx.strokeStyle = '#3b82f6';
                this.ctx.lineWidth = 2 / this.zoom;
                this.ctx.strokeRect(element.x - 20 / this.zoom, element.y - 10 / this.zoom, 40 / this.zoom, 20 / this.zoom);
            }
            return;
        }

        if (element.type === 'planter') {
            this.ctx.save();
            this.ctx.translate(element.x, element.y);
            this.ctx.rotate(element.rotation || 0);
            this.ctx.fillStyle = '#8b5a2b';
            this.ctx.fillRect(-10 / this.zoom, -8 / this.zoom, 20 / this.zoom, 16 / this.zoom);
            this.ctx.restore();
            if (isSelected) {
                this.ctx.strokeStyle = '#3b82f6';
                this.ctx.lineWidth = 2 / this.zoom;
                this.ctx.strokeRect(element.x - 10 / this.zoom, element.y - 8 / this.zoom, 20 / this.zoom, 16 / this.zoom);
            }
            return;
        }
        
        if (element.type === 'lighting') {
            this.ctx.fillStyle = '#fbbf24';
            this.ctx.beginPath();
            this.ctx.arc(element.x, element.y, 6 / this.zoom, 0, 2 * Math.PI);
            this.ctx.fill();
            if (isSelected) {
                this.ctx.strokeStyle = '#3b82f6';
                this.ctx.lineWidth = 2 / this.zoom;
                this.ctx.stroke();
            }
            return;
        }
        
        if (element.type === 'stairs') {
            this.ctx.save();
            this.ctx.translate(element.x, element.y);
            this.ctx.rotate(element.rotation || 0);
            const color = this.getElementColor(element.type, 1);
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = (isSelected ? 4 : 3) / this.zoom;
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(element.length, 0);
            this.ctx.stroke();
            this.ctx.restore();
            
            if (isSelected) {
                this.ctx.strokeStyle = '#3b82f6';
                this.ctx.lineWidth = 2 / this.zoom;
                this.ctx.stroke();
            }
            return;
        }
        
        if (['pergola', 'pool', 'spa'].includes(element.type) && element.width && element.height) {
            this.ctx.fillStyle = this.getElementColor(element.type, 0.3);
            this.ctx.strokeStyle = this.getElementColor(element.type, 1);
            this.ctx.lineWidth = (isSelected ? 3 : 2) / this.zoom;
            
            this.ctx.fillRect(element.x, element.y, element.width, element.height);
            this.ctx.strokeRect(element.x, element.y, element.width, element.height);
            
            this.ctx.fillStyle = '#000';
            this.ctx.font = `${12 / this.zoom}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(
                this.getElementDescription(element),
                element.x + element.width/2,
                element.y + element.height/2
            );
            return;
        }
        
        if (!element.path || element.path.length < 2) return;
        
        if (this.isAreaTool(element.type)) {
            this.ctx.fillStyle = this.getElementColor(element.type, 0.3);
            this.ctx.strokeStyle = this.getElementColor(element.type, 1);
            this.ctx.lineWidth = (isSelected ? 3 : 2) / this.zoom;
            
            this.ctx.beginPath();
            element.path.forEach((point, index) => {
                if (index === 0) {
                    this.ctx.moveTo(point.x, point.y);
                } else {
                    this.ctx.lineTo(point.x, point.y);
                }
            });
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        } else {
            this.ctx.strokeStyle = this.getElementColor(element.type, 1);
            this.ctx.lineWidth = (isSelected ? 4 : 3) / this.zoom;
            
            this.ctx.beginPath();
            element.path.forEach((point, index) => {
                if (index === 0) {
                    this.ctx.moveTo(point.x, point.y);
                } else {
                    this.ctx.lineTo(point.x, point.y);
                }
            });
            this.ctx.stroke();
        }
        
        // Show measurements on hover for completed elements
        if (this.showMeasurements && this.scaleSet && !this.isDrawing) {
            this.showElementMeasurements(element);
        }
    }

    showElementMeasurements(element) {
        if (element.type === 'trees' || element.type === 'lighting') {
            return; // No measurements for point elements
        }
        
        if (element.type === 'stairs') {
            const length = element.actualLength || (element.length / this.scale);
            const steps = Math.ceil(length / 0.3);
            const midX = element.x + element.length / 2;
            const midY = element.y - 10 / this.zoom;
            
            this.ctx.fillStyle = 'rgba(34, 197, 94, 0.9)';
            this.ctx.fillRect(midX - 30, midY - 8, 60, 16);
            this.ctx.fillStyle = 'white';
            this.ctx.font = `${10 / this.zoom}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`${steps} steps`, midX, midY + 3);
            return;
        }
        
        if (['pergola', 'pool', 'spa'].includes(element.type) && element.actualWidth && element.actualHeight) {
            const centerX = element.x + element.width / 2;
            const centerY = element.y + element.height / 2;
            
            this.ctx.fillStyle = 'rgba(34, 197, 94, 0.9)';
            this.ctx.fillRect(centerX - 40, centerY - 8, 80, 16);
            this.ctx.fillStyle = 'white';
            this.ctx.font = `${10 / this.zoom}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`${element.actualWidth}m × ${element.actualHeight}m`, centerX, centerY + 3);
            return;
        }
        
        if (element.path) {
            if (this.isAreaTool(element.type)) {
                const area = this.calculateArea(element.path) / (this.scale * this.scale);
                const centerX = element.path.reduce((sum, p) => sum + p.x, 0) / element.path.length;
                const centerY = element.path.reduce((sum, p) => sum + p.y, 0) / element.path.length;
                
                this.ctx.fillStyle = 'rgba(34, 197, 94, 0.9)';
                this.ctx.fillRect(centerX - 30, centerY - 8, 60, 16);
                this.ctx.fillStyle = 'white';
                this.ctx.font = `${10 / this.zoom}px Arial`;
                this.ctx.textAlign = 'center';
                this.ctx.fillText(`${area.toFixed(2)}m²`, centerX, centerY + 3);
            } else {
                const length = this.calculateLength(element.path) / this.scale;
                const centerX = element.path.reduce((sum, p) => sum + p.x, 0) / element.path.length;
                const centerY = element.path.reduce((sum, p) => sum + p.y, 0) / element.path.length;
                
                this.ctx.fillStyle = 'rgba(34, 197, 94, 0.9)';
                this.ctx.fillRect(centerX - 25, centerY - 8, 50, 16);
                this.ctx.fillStyle = 'white';
                this.ctx.font = `${10 / this.zoom}px Arial`;
                this.ctx.textAlign = 'center';
                this.ctx.fillText(`${length.toFixed(2)}m`, centerX, centerY + 3);
            }
        }
    }

    getElementColor(type, alpha) {
        const colors = {
            'driveway-concrete': `rgba(107, 114, 128, ${alpha})`,
            'plain-concrete': `rgba(156, 163, 175, ${alpha})`,
            'paving': `rgba(220, 38, 38, ${alpha})`,
            'decking': `rgba(234, 88, 12, ${alpha})`,
            'garden-beds': `rgba(22, 163, 74, ${alpha})`,
            'lawn': `rgba(34, 197, 94, ${alpha})`,
            'shed': `rgba(146, 64, 14, ${alpha})`,
            'fence-boundary': `rgba(75, 85, 99, ${alpha})`,
            'fence-front': `rgba(55, 65, 81, ${alpha})`,
            'pool-fence': `rgba(59, 130, 246, ${alpha})`,
            'garden-edge': `rgba(101, 163, 13, ${alpha})`,
            'screen': `rgba(120, 113, 108, ${alpha})`,
            'retaining-wall': `rgba(87, 83, 78, ${alpha})`,
            'stairs': `rgba(168, 162, 158, ${alpha})`,
            'pergola': `rgba(234, 88, 12, ${alpha})`,
            'pool': `rgba(59, 130, 246, ${alpha})`,
            'spa': `rgba(146, 64, 14, ${alpha})`
        };
        return colors[type] || `rgba(107, 114, 128, ${alpha})`;
    }

    updateQuote() {
        const quoteContent = document.getElementById('quoteContent');
        const elementsList = document.getElementById('elementsList');
        
        if (this.elements.length === 0) {
            quoteContent.innerHTML = `
                <div class="text-gray-500 text-center py-4">
                    <i class="fas fa-info-circle text-2xl mb-2"></i>
                    <div>Start drawing to generate quote</div>
                </div>`;
            elementsList.innerHTML = `
                <div class="text-gray-500 text-center py-4">
                    <i class="fas fa-plus-circle text-2xl mb-2"></i>
                    <div>No elements added yet</div>
                </div>`;
            document.getElementById('totalCost').textContent = '$0.00';
            return;
        }
        
        const quote = this.generateQuote();
        
        let quoteHTML = '';
        let elementsHTML = '';
        let total = 0;
        
        Object.entries(quote).forEach(([category, items]) => {
            if (items.length > 0) {
                quoteHTML += `<div class="mb-3">
                    <h4 class="font-semibold text-xs text-gray-700 mb-2">${category}</h4>`;
                
                items.forEach(item => {
                    total += item.total;
                    quoteHTML += `<div class="flex justify-between text-xs mb-1 p-2 bg-gray-50 rounded">
                        <span class="truncate mr-2">${item.description}</span>
                        <span class="whitespace-nowrap font-medium">$${item.total.toFixed(0)}</span>
                    </div>`;
                });
                
                quoteHTML += '</div>';
            }
        });

        // Group elements by type for better organization
        const elementGroups = this.groupElementsByType();
        
        elementsHTML = '';
        Object.entries(elementGroups).forEach(([category, elements]) => {
            if (elements.length > 0) {
                elementsHTML += `<div class="mb-3">
                    <h4 class="font-semibold text-xs text-gray-700 mb-2">${category}</h4>`;
                
                elements.forEach((element, index) => {
                    const measurement = this.calculateMeasurement(element);
                    const description = this.getElementDescription(element);
                    const isSelected = this.selectedElement === element;
                    
                    elementsHTML += `<div class="element-list-item ${isSelected ? 'selected' : ''}" onclick="window.gardenTool.selectElementFromList(${element.originalIndex})">
                        <div class="flex justify-between items-start">
                            <div class="flex-1 min-w-0">
                                <div class="font-medium truncate">${description}</div>
                                <div class="text-xs text-gray-500">${measurement}</div>
                            </div>
                            <div class="element-actions">
                                <button onclick="event.stopPropagation(); window.gardenTool.editElement(${element.originalIndex})" class="element-action-btn edit-btn" title="Edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="event.stopPropagation(); window.gardenTool.deleteElement(${element.originalIndex})" class="element-action-btn delete-btn" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>`;
                });
                
                elementsHTML += '</div>';
            }
        });
        
        quoteContent.innerHTML = quoteHTML;
        elementsList.innerHTML = elementsHTML;
        document.getElementById('totalCost').textContent = `$${total.toFixed(0)}`;
    }

    groupElementsByType() {
        const groups = {};
        
        this.elements.forEach((element, index) => {
            element.originalIndex = index; // Store original index for editing/deleting
            
            let category = 'Other Elements';
            
            if (element.type === 'trees') {
                category = 'Trees & Shrubs';
            } else if (element.type === 'shrubs') {
                category = 'Trees & Shrubs';
            } else if (element.type === 'lighting') {
                category = 'Lighting';
            } else if (element.type === 'seating') {
                category = 'Seating';
            } else if (element.type === 'water-feature') {
                category = 'Water Features';
            } else if (element.type === 'outdoor-kitchen') {
                category = 'Outdoor Kitchen';
            } else if (this.isAreaTool(element.type)) {
                category = 'Area Elements';
            } else if (this.isLinearTool(element.type)) {
                category = 'Linear Elements';
            } else if (['pergola', 'pool', 'spa', 'shed'].includes(element.type)) {
                category = 'Structures';
            }
            
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(element);
        });
        
        return groups;
    }

    selectElementFromList(index) {
        this.selectedElement = this.elements[index];
        if (this.editMode) {
            this.showEditPoints(this.selectedElement);
        }
        this.redraw();
        this.updateQuote();
    }

    generateQuote() {
        const quote = {
            'Area Elements': [],
            'Linear Elements': [],
            'Items': [],
            'Additional Items': []
        };
        
        const elementCounts = {};
        
        this.elements.forEach(element => {
            const key = element.subtype ? `${element.type}-${element.subtype}` : element.type;
            if (!elementCounts[key]) {
                elementCounts[key] = [];
            }
            elementCounts[key].push(element);
        });
        
        Object.entries(elementCounts).forEach(([key, elements]) => {
            const element = elements[0];
            const rate = this.getElementRate(element);
            const description = this.getElementDescription(element);
            
            if (element.type === 'trees') {
                quote['Items'].push({
                    description: description,
                    quantity: elements.length,
                    unit: 'ea',
                    rate: rate,
                    total: elements.length * rate
                });
            } else if (['pergola', 'pool', 'spa'].includes(element.type)) {
                quote['Items'].push({
                    description: description,
                    quantity: elements.length,
                    unit: 'ea',
                    rate: rate,
                    total: elements.length * rate
                });
            } else if (element.type === 'stairs') {
                let totalSteps = 0;
                elements.forEach(el => {
                    if (el.path && this.scaleSet) {
                        const length = this.calculateLength(el.path) / this.scale;
                        totalSteps += Math.ceil(length / 0.3);
                    }
                });
                
                if (totalSteps > 0) {
                    quote['Linear Elements'].push({
                        description: description,
                        quantity: totalSteps,
                        unit: 'steps',
                        rate: rate,
                        total: totalSteps * rate
                    });
                }
            } else if (this.isAreaTool(element.type)) {
                let totalArea = 0;
                elements.forEach(el => {
                    if (el.path && this.scaleSet) {
                        totalArea += this.calculateArea(el.path) / (this.scale * this.scale);
                    }
                });
                
                if (totalArea > 0) {
                    quote['Area Elements'].push({
                        description: description,
                        quantity: totalArea.toFixed(2),
                        unit: 'm²',
                        rate: rate,
                        total: totalArea * rate
                    });
                }
            } else if (this.isLinearTool(element.type)) {
                let totalLength = 0;
                elements.forEach(el => {
                    if (el.path && this.scaleSet) {
                        totalLength += this.calculateLength(el.path) / this.scale;
                    }
                });
                
                if (totalLength > 0) {
                    quote['Linear Elements'].push({
                        description: description,
                        quantity: totalLength.toFixed(2),
                        unit: 'm',
                        rate: rate,
                        total: totalLength * rate
                    });
                }
            }
        });
        
        return quote;
    }

    getElementRate(element) {
        if (['pergola', 'pool', 'spa'].includes(element.type)) {
            return this.presetConfigs[element.type]?.price || this.rates[element.type] || 0;
        }
        
        if (element.subtype) {
            const subtypeKey = `${element.type}-${element.subtype.toLowerCase().replace(/\s+/g, '-')}`;
            return this.rates[subtypeKey] || this.rates[element.type] || 0;
        }
        
        return this.rates[element.type] || 0;
    }

    setupRateModal() {
        const areaElements = ['driveway-concrete', 'plain-concrete', 'paving', 'decking', 'garden-beds', 'lawn', 'shed'];
        const linearElements = ['fence-boundary', 'fence-front', 'pool-fence', 'garden-edge', 'screen', 'retaining-wall', 'stairs'];
        const itemElements = ['seating', 'water-feature', 'pergola', 'pool', 'spa', 'outdoor-kitchen', 'trees', 'shrubs', 'lighting'];
        
        this.createRateInputs('areaRates', areaElements);
        this.createRateInputs('linearRates', linearElements);
        this.createRateInputs('itemRates', itemElements);
    }

    changeState(state) {
        this.selectedState = state;
        this.showNotification(`Switched to ${state} rates`, 'info');
        // Here you could load different rates for different states
        // For now, we'll keep the QLD rates as default
    }

    createRateInputs(containerId, elements) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        
        elements.forEach(element => {
            const div = document.createElement('div');
            div.className = 'border rounded p-3 bg-gray-50';
            
            let optionsHTML = '';
            if (this.elementSubtypes[element]) {
                Object.entries(this.elementSubtypes[element]).forEach(([subtype, config]) => {
                    const key = `${element}-${subtype.toLowerCase().replace(/\s+/g, '-')}`;
                    optionsHTML += `
                        <div class="flex justify-between items-center mb-2">
                            <input type="text" id="desc-${key}" value="${config.description}" 
                                   class="flex-1 text-xs p-1 border rounded mr-2" placeholder="Description">
                            <input type="number" id="rate-${key}" value="${config.rate}" 
                                   class="w-20 text-xs p-1 border rounded" step="0.01">
                        </div>
                    `;
                });
            } else {
                const description = this.elementDescriptions[element] || element;
                optionsHTML = `
                    <div class="flex justify-between items-center mb-2">
                        <input type="text" id="desc-${element}" value="${description}" 
                               class="flex-1 text-xs p-1 border rounded mr-2" placeholder="Description">
                        <input type="number" id="rate-${element}" value="${this.rates[element] || 0}" 
                               class="w-20 text-xs p-1 border rounded" step="0.01">
                    </div>
                `;
            }
            
            div.innerHTML = `
                <h4 class="font-semibold text-sm mb-2">${element.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}</h4>
                ${optionsHTML}
            `;
            container.appendChild(div);
        });
    }

    showRateModal() {
        document.getElementById('rateModal').classList.remove('hidden');
    }

    hideRateModal() {
        document.getElementById('rateModal').classList.add('hidden');
    }

    saveRates() {
        // Save all rates and descriptions
        document.querySelectorAll('[id^="rate-"]').forEach(input => {
            const key = input.id.replace('rate-', '');
            this.rates[key] = parseFloat(input.value) || 0;
        });
        
        document.querySelectorAll('[id^="desc-"]').forEach(input => {
            const key = input.id.replace('desc-', '');
            this.elementDescriptions[key] = input.value || key;
        });
        
        this.hideRateModal();
        this.updateQuote();
        this.showNotification('Rates saved successfully', 'success');
    }

    resetRates() {
        if (confirm('Are you sure you want to reset all rates to default values?')) {
            this.initializeRatesAndDescriptions();
            this.setupRateModal();
            this.updateQuote();
            this.showNotification('Rates reset to default values', 'success');
        }
    }

    selectPreset(type) {
        this.currentTool = 'preset';
        this.presetType = type;
        document.getElementById('toolSelect').value = 'preset';
        this.updateDrawingStatus();
        this.showNotification(`Click on the plan to place ${this.presetConfigs[type].description}`, 'info');
    }

    addPresetElement(x, y) {
        if (!this.presetType) return;
        
        this.saveState();
        const config = this.presetConfigs[this.presetType];
        const pixelWidth = this.scaleSet ? config.width * this.scale : config.width * 20;
        const pixelHeight = this.scaleSet ? config.height * this.scale : config.height * 20;
        
        const element = {
            type: this.presetType,
            x: x - pixelWidth/2,
            y: y - pixelHeight/2,
            width: pixelWidth,
            height: pixelHeight,
            actualWidth: config.width,
            actualHeight: config.height,
            id: Date.now()
        };
        
        this.elements.push(element);
        this.redraw();
        this.updateQuote();
        
        this.currentTool = 'select';
        this.presetType = null;
        document.getElementById('toolSelect').value = 'select';
        this.updateDrawingStatus();
        this.showNotification(`${config.description} added to design`, 'success');
    }

    handleFileUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        if (file.type === 'application/pdf') {
            this.loadPdfFile(file);
        } else {
            this.loadImageFile(file);
        }
    }

    loadImageFile(file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                this.backgroundImage = img;
                this.redraw();
                this.showNotification('Background image loaded successfully', 'success');
            };
            img.onerror = () => {
                this.showNotification('Error loading image file', 'error');
            };
            img.src = event.target.result;
        };
        reader.onerror = () => {
            this.showNotification('Error reading file', 'error');
        };
        reader.readAsDataURL(file);
    }

    loadPdfFile(file) {
        // For PDF handling, we'll use a simple approach
        // In a real implementation, you'd use a PDF.js library
        this.showNotification('PDF support requires PDF.js library. Converting to image...', 'info');
        
        // For now, we'll show a placeholder and ask user to convert PDF to image
        const reader = new FileReader();
        reader.onload = (event) => {
            // Create a placeholder for PDF
            this.pdfDocument = {
                name: file.name,
                pages: 1 // Placeholder
            };
            
            // Show page selection
            this.showPdfPageSelection();
            this.showNotification('Please convert PDF to image format for better compatibility', 'warning');
        };
        reader.readAsDataURL(file);
    }

    showPdfPageSelection() {
        const pageSelect = document.getElementById('pdfPageSelect');
        const pageSelection = document.getElementById('pdfPageSelection');
        
        pageSelect.innerHTML = '<option value="1">Page 1</option>';
        pageSelection.classList.remove('hidden');
    }

    loadPdfPage() {
        // Placeholder for PDF page loading
        this.showNotification('PDF page loading functionality requires PDF.js integration', 'info');
    }

    deleteElement(index) {
        if (confirm('Are you sure you want to delete this element?')) {
            this.saveState();
            this.elements.splice(index, 1);
            this.selectedElement = null;
            this.redraw();
            this.updateQuote();
            this.showNotification('Element deleted', 'success');
        }
    }

    editElement(index) {
        const element = this.elements[index];
        if (!element) return;

        const currentDescription = this.getElementDescription(element);
        const newDescription = prompt(`Edit description:`, currentDescription);
        
        if (newDescription && newDescription.trim()) {
            element.customDescription = newDescription.trim();
            this.updateQuote();
            this.showNotification('Element description updated', 'success');
        }
    }

    clearAll() {
        if (confirm('Are you sure you want to clear all elements? (Background image will be preserved)')) {
            this.saveState();
            this.elements = [];
            this.currentPath = [];
            this.isDrawing = false;
            this.selectedElement = null;
            this.scalingMode = false;
            this.scalePoints = [];
            this.clearRulerLines();
            this.updateDrawingStatus();
            this.redraw();
            this.updateQuote();
            this.showNotification('All elements cleared', 'success');
        }
    }

    generatePDF() {
        this.showLoading(true);
        
        setTimeout(() => {
            const clientName = document.getElementById('clientName').value || 'Not specified';
            const projectAddress = document.getElementById('projectAddress').value || 'Not specified';
            
            let html = `
                <html>
                <head>
                    <title>Initial Garden Construction Estimate</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f8f9fa; }
                        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                        .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #0ea5e9; padding-bottom: 20px; }
                        .header h1 { color: #1e40af; margin: 0; font-size: 28px; }
                        .header p { color: #64748b; margin: 5px 0; }
                        .client-info { background-color: #f0f9ff; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #0ea5e9; }
                        .section { margin-bottom: 25px; }
                        .section h3 { color: #1e40af; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 15px; }
                        .section h4 { color: #374151; margin-top: 20px; margin-bottom: 10px; }
                        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
                        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
                        th { background-color: #f8fafc; font-weight: 600; color: #374151; }
                        tr:hover { background-color: #f8fafc; }
                        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Initial Garden Construction Estimate</h1>
                            <p>Date: ${new Date().toLocaleDateString()}</p>
                        </div>
                        
                        <div class="client-info">
                            <h3>Client Information</h3>
                            <p><strong>Client Name:</strong> ${clientName}</p>
                            <p><strong>Project Address:</strong> ${projectAddress}</p>
                        </div>
            `;
            
            // Generate categorized elements without rates
            const categorizedElements = this.categorizeElementsForPDF();
            
            Object.entries(categorizedElements).forEach(([category, elements]) => {
                if (elements.length > 0) {
                    html += `<div class="section">
                        <h3>${category}</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Description</th>
                                    <th>Quantity</th>
                                    <th>Unit</th>
                                </tr>
                            </thead>
                            <tbody>`;
                    
                    elements.forEach(element => {
                        const quantity = this.calculateQuantity(element);
                        const unit = this.getUnitForElement(element);
                        
                        html += `<tr>
                            <td>${this.getElementDescription(element)}</td>
                            <td>${quantity.toFixed(2)}</td>
                            <td>${unit}</td>
                        </tr>`;
                    });
                    
                    html += `</tbody>
                    </table>
                    </div>`;
                }
            });

            html += `<div class="section">
                <h3>Terms and Conditions – Initial Garden Construction Estimate</h3>
                
                <h4>Scope of Works Inclusions and Clarifications</h4>
                <ol>
                    <li>The cost estimate provided is based on the preliminary design concepts discussed during the initial meeting (either on-site or online), including garden design elements, walls, and other landscaping features. Exact dimensions and areas have not yet been confirmed and will be finalised during the design process.</li>
                    <li>The budget presented is valid for 30 days from the date of this estimate.</li>
                    <li>This estimate serves as a general cost indication, with the final pricing to be confirmed upon development of accurate designs based on the agreed scope of work.</li>
                </ol>

                <h4>Variations and Adjustments</h4>
                <ol>
                    <li>The initial estimate is based on an approximate understanding of the project's scope and layout. Any changes in the square meter or linear meter measurement during the design phase will lead to adjustments in the final cost. However, the unit rate per square meter/linear meter will remain the same as quoted.</li>
                    <li>The final construction price may be subject to changes in the scope due to factors such as unforeseen site conditions, earthworks, or accessibility that could not be fully assessed during the initial consultation.</li>
                    <li>Site preparation and accessibility will be further confirmed based on the actual site conditions. Any additional costs related to these factors will be communicated and agreed upon during the design phase.</li>
                </ol>

                <h4>Design-Only Commitment and Refund Policy</h4>
                <p>The $5000 deposit is non-refundable and will be fully applied toward the design services during the preliminary and detailed design phases.</p>
                <p>If the client decides not to proceed with the construction after receiving the final design and pricing, no further payment is required beyond the $5000 deposit. The design documents produced up to that point will be provided to the client for their records and potential use.</p>
                <p>The deposit covers the time, expertise, and administrative efforts involved in site assessment, concept development, preliminary quoting, and detailed design preparation.</p>

                <h4>Contact Details</h4>
                <p><strong>Company:</strong> Mood Design Group</p>
                <p><strong>Contact:</strong> Angie Li</p>
                <p><strong>Number:</strong> 0450 107 606</p>
                <p><strong>Email:</strong> <a href="mailto:admin@moondesigngroup.com.au">admin@moondesigngroup.com.au</a></p>
                
                <h5>Bank Details:</h5>
                <p><strong>Account Name:</strong> MDG International Pty Ltd</p>
                <p><strong>BSB:</strong> 065-005</p>
                <p><strong>Account Number:</strong> 1082-8511</p>
                <p><strong>Bank Name:</strong> Commonwealth Bank</p>
            </div>
                </body>
                </html>`;
            
            const newWindow = window.open('', '_blank');
            newWindow.document.write(html);
            newWindow.document.close();
            newWindow.print();
            
            this.showLoading(false);
            this.showNotification('PDF estimate generated successfully', 'success');
        }, 1000);
    }

    categorizeElementsForPDF() {
        const categories = {
            'Area Elements': [],
            'Linear Elements': [],
            'Item Elements': []
        };
        
        this.elements.forEach(element => {
            if (this.isAreaTool(element.type)) {
                categories['Area Elements'].push(element);
            } else if (this.isLinearTool(element.type)) {
                categories['Linear Elements'].push(element);
            } else {
                categories['Item Elements'].push(element);
            }
        });
        
        return categories;
    }

    calculateQuantity(element) {
        if (element.type === 'trees' || element.type === 'shrubs' || element.type === 'lighting' || 
            element.type === 'seating' || element.type === 'water-feature' || element.type === 'outdoor-kitchen' || 
            element.type === 'planter') {
            return 1; // Unit items
        } else if (element.type === 'stairs') {
            return element.actualLength || 1;
        } else if (element.path && element.path.length > 1) {
            if (this.isAreaTool(element.type)) {
                return this.calculateArea(element.path);
            } else {
                return this.calculateLength(element.path);
            }
        } else if (element.width && element.height) {
            return element.width * element.height;
        }
        return 1;
    }

    getUnitForElement(element) {
        if (element.type === 'trees' || element.type === 'shrubs' || element.type === 'lighting' || 
            element.type === 'seating' || element.type === 'water-feature' || element.type === 'outdoor-kitchen' || 
            element.type === 'planter') {
            return 'unit';
        } else if (element.type === 'stairs') {
            return 'm';
        } else if (this.isAreaTool(element.type)) {
            return 'm²';
        } else {
            return 'm';
        }
    }

    exportProject() {
        const projectData = {
            elements: this.elements,
            scale: this.scale,
            scaleSet: this.scaleSet,
            backgroundImage: this.backgroundImage ? this.backgroundImage.src : null,
            rates: this.rates,
            elementDescriptions: this.elementDescriptions,
            presetConfigs: this.presetConfigs,
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(projectData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `garden-design-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showNotification('Project exported successfully', 'success');
    }

    showHelpModal() {
        document.getElementById('helpModal').classList.remove('hidden');
    }

    hideHelpModal() {
        document.getElementById('helpModal').classList.add('hidden');
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (show) {
            overlay.classList.remove('hidden');
        } else {
            overlay.classList.add('hidden');
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.gardenTool = new GardenDesignTool();
}); 