package vn.infodation.intern.group1.mas.service;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import vn.infodation.intern.group1.mas.domain.Equipment;
import vn.infodation.intern.group1.mas.repository.EquipmentRepository;
import vn.infodation.intern.group1.mas.repository.AreaRepository;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;



@Service
@Transactional
public class SaveFileService{
    private final String FILE_DIRECTORY = "/csv/equipments/";
    private final Path root = Paths.get(FILE_DIRECTORY);
//    private static final Logger log =  LoggerFactory.getLogger(SaveFileService.class);
    public SaveFileService(AreaRepository areaRepository,
                           EquipmentRepository equipmentRepository) {
        super();
        this.areaRepository = areaRepository;
        this.equipmentRepository = equipmentRepository;

        File directory = new File(FILE_DIRECTORY);
//        log.info("File directory {}", root);
        if(!directory.exists())
            directory.mkdirs();

    }

    private AreaRepository areaRepository;
    private EquipmentRepository equipmentRepository;

    public Resource load(String filename) {
        try {
            Path file = root.resolve(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Could not read the file!");
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }

    public Resource getEquipmentFile(String filename, HttpServletResponse response) {
        response.setContentType("text/csv; charset=utf-8");
        response.setHeader("Content-Disposition", "attachment; filename=" + filename);
        response.setHeader("filename", filename);

        return new FileSystemResource(FILE_DIRECTORY + filename);
    }

    public void handleEquipmentFile(MultipartFile file) {
        Path filePath = Paths.get(FILE_DIRECTORY + "/" + file.getOriginalFilename());

        try {
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            File convFile = filePath.toFile();
            FileReader  fr = new FileReader(convFile);
            BufferedReader br = new BufferedReader(fr);
            String line = br.readLine();
            while( (line = br.readLine()) != null) {
                if(!line.isBlank()) {
                    String[] split = line.split(",");
                    if(split.length == 6) {
                        Equipment equipment;
                        boolean newEqm = false;


                        if(!split[0].isBlank()) { //Equipment ID
                            Long EID = Long.parseLong(split[0]);
                            if(equipmentRepository.existsById(EID)) {
                                equipment = equipmentRepository.getOne(EID);
                                System.out.println("Equipment existed");
                            }
                            else {
                                System.out.println("Equipment not found");
                                continue;
                            }
                        }
                        else {
                            equipment = new Equipment();
                            newEqm = true;
                            System.out.println("New Equipment");
                        }

                        if(!split[1].isBlank())	//Equipment Name
                            equipment.setEquipmentName(split[1]);
                        else if(newEqm) continue;

                        if(!split[2].isBlank()) 	//Equipment Technical Features
                           equipment.setTechnicalFeatures(split[2]);
                        else if(newEqm) continue;

                        if(!split[3].isBlank())	//Equipment Serial Number
                            equipment.setSerialNumber(split[3]);
                        else if(newEqm) continue;

                        if(!split[4].isBlank())	//Equipment note
                           equipment.setNote(split[4]);
                        else if(newEqm) continue;

                        if(!split[5].isBlank()) {	//Equipment Area
                            Long AID = Long.parseLong(split[5]);
                            if(areaRepository.existsById(AID))
                                equipment.setArea(areaRepository.getOne(AID));
                            else if(newEqm) continue;
                        }
                        else continue;

                        Equipment savedEquipment = equipmentRepository.save(equipment);

                        System.out.println(
                            "-------------------------------------\n" +
                                "Saved Equipment: \n" +
                                "- ID Equipment: " + savedEquipment.getId() +"\n" +
                                "- Name equipment: " + savedEquipment.getEquipmentName() +"\n" +
                                "- Technical Features: " + savedEquipment.getTechnicalFeatures() +"\n" +
                                "- Serial Number: " + savedEquipment.getSerialNumber() + "\n" +
                                "- Note: " + savedEquipment.getNote() + "\n" +
                                "- Area: " + savedEquipment.getArea().getAreaName() + "\n" +
                                "-------------------------------------\n"
                        );
                    }
                }
            }

            br.close();
        }
        catch(IOException e){
            e.printStackTrace();
        }
    }

    public void writeFile(Equipment equipment) {
        String filename = equipment.getId() + ".csv";
        String path = "/csv/equipments/";

        File directory = new File(path);
        if(!directory.exists()) {
            directory.mkdirs();
        }

        File file = new File(path + filename);
        if(!file.exists()) {
            try {
                final String SEPERATOR = ",";
                final String fileHeader = "equipment_id,equipment_name,technical_features,serial_number,note,area_id";
                final String[] elements = new String[] {
                    equipment.getId().toString(),
                    equipment.getEquipmentName(),
                    equipment.getTechnicalFeatures(),
                    equipment.getSerialNumber(),
                    equipment.getNote(),
                    equipment.getArea().getId().toString()
                };

                String value = fileHeader + "\n";

                for (String string : elements) {
                    value += string;
                    if(string != elements[elements.length - 1])
                        value += SEPERATOR;
                }

                FileWriter fw = new FileWriter(file.getAbsoluteFile());
                BufferedWriter bw = new BufferedWriter(fw);
                bw.write(value);
                bw.close();
            }
            catch (IOException e){
                e.printStackTrace();
            }
        }
    }

    public void writeFile() {
        String filename = "equipments.csv";
        String path = "/csv/equipments/";
        List<Equipment> x = equipmentRepository.findAll();

        File directory = new File(path);
        if(!directory.exists()) {
            directory.mkdirs();
        }

        File file = new File(path + filename);
        final String fileHeader = "equipment_id,equipment_name,technical_features,serial_number,note,area_id";
        final String SEPERATOR = ",";
        String value = fileHeader + "\n";

        try {
            for (Equipment equipment : x) {
                final String[] elements = new String[] {
                    equipment.getId().toString(),
                    equipment.getEquipmentName(),
                    equipment.getTechnicalFeatures(),
                    equipment.getSerialNumber(),
                    equipment.getNote(),
                    equipment.getArea().getId().toString()
                };

                for (String string : elements) {
                    value += string;
                    if(string != elements[elements.length - 1])
                        value += SEPERATOR;
                }

                value += "\n";
            }

            FileWriter fw = new FileWriter(file.getAbsoluteFile());
            BufferedWriter bw = new BufferedWriter(fw);
            bw.write(value);
            bw.close();
        }catch (IOException e){
            e.printStackTrace();
        }
    }
}