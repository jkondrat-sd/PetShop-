DogCatStore_Backend/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── dogcatstore/
│   │   │           ├── DogCatStoreApplication.java
│   │   │           ├── controller/
│   │   │           │   ├── AnimalController.java
│   │   │           │   └── AccessoryController.java
│   │   │           ├── service/
│   │   │           │   ├── AnimalService.java
│   │   │           │   └── AccessoryService.java
│   │   │           ├── repository/
│   │   │           │   ├── AnimalRepository.java
│   │   │           │   └── AccessoryRepository.java
│   │   │           ├── entity/
│   │   │           │   ├── AnimalEntity.java
│   │   │           │   └── AccessoryEntity.java
│   │   │           ├── dto/
│   │   │           │   ├── AnimalDTO.java
│   │   │           │   └── AccessoryDTO.java
│   │   │           └── exception/
│   │   │               ├── ResourceNotFoundException.java
│   │   │               └── GlobalExceptionHandler.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── static/
│   │           └── images/
│   └── test/
│       └── java/
│           └── com/
│               └── dogcatstore/
│                   ├── AnimalControllerTest.java
│                   └── AccessoryControllerTest.java
│
├── .gitignore
├── pom.xml
└── README.md