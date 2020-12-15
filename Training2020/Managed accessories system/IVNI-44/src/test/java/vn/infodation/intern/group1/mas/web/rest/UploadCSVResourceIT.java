package vn.infodation.intern.group1.mas.web.rest;

import vn.infodation.intern.group1.mas.ManagedAccessoriesSystemApp;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
/**
 * Test class for the UploadCSVResource REST controller.
 *
 * @see UploadCSVResource
 */
@SpringBootTest(classes = ManagedAccessoriesSystemApp.class)
public class UploadCSVResourceIT {

    private MockMvc restMockMvc;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);

        UploadCSVResource uploadCSVResource = new UploadCSVResource();
        restMockMvc = MockMvcBuilders
            .standaloneSetup(uploadCSVResource)
            .build();
    }

    /**
     * Test upload
     */
    @Test
    public void testUpload() throws Exception {
        restMockMvc.perform(post("/api/upload-csv/upload"))
            .andExpect(status().isOk());
    }

    /**
     * Test getFile
     */
    @Test
    public void testGetFile() throws Exception {
        restMockMvc.perform(get("/api/upload-csv/get-file"))
            .andExpect(status().isOk());
    }
}
